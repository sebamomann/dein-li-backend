def image
def branch_name = "${env.BRANCH_NAME}" as String
def build_number = "${env.BUILD_NUMBER}" as String
def commit_hash

def tag_name = 'jb_' + branch_name + "_" + build_number

def api_image_name = 'dein-li/dein-li-backend:' + tag_name
def container_database_name = 'dein-li_newman-testing_db_' + tag_name
def container_newman_name = 'dein-li_newman-testing_newman_' + tag_name
def container_backend_name = 'dein-li_newman-testing_backend_' + tag_name
def network_name = 'dein-li_newman-testing_network_' + tag_name

// Production deployment (replaces the old Portainer stack + localhost:34015 registry, which no longer exists)
def app_container = 'dein-li-backend'
def app_network = 'dein-li'
def app_port = '34250'
// Root-only env file on the host, mounted as /app/.env (read by dotenv in app.module.ts)
def app_env_file = '/var/www/vhosts/sebamomann.de/dein-li/backend.env'
// Postman environment with the bearer_* tokens the collection needs. Newman is skipped if it is missing.
def newman_env_file = '/var/www/vhosts/sebamomann.de/dein-li/newman.postman_environment'

pipeline {
    agent any

    environment {
        GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN = credentials('GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '7'))
        ansiColor('xterm')
    }

    stages {
        stage('Preamble') {
            steps {
                script {
                    echo 'Updating status'
                    updateStatus("pending")
                }
                script {
                    commit_hash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

                    echo 'Control Variables'
                    echo '-------------------'
                    echo "COMMIT HASH: ${commit_hash}"
                    echo "BRANCH NAME: ${branch_name}"
                    echo "BUILD NUMBER: ${build_number}"
                }
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    image = docker.build(api_image_name)
                }
            }
        }

        stage('Newman - prepare API') {
            steps {
                script {
                    echo 'Spinup network'

                    try {
                        sh 'docker network create ' + network_name
                    } catch (err) {
                        echo err.getMessage()
                    }
                }
                script {
                    sh 'MYSQL_CONTAINER_NAME=' + container_database_name + ' ' +
                            'BACKEND_CONTAINER_NAME=' + container_backend_name + ' ' +
                            'API_IMAGE_NAME=' + api_image_name + ' ' +
                            'NEWMAN_CONTAINER_NAME=' + container_newman_name + ' ' +
                            'NETWORK_NAME=' + network_name + ' ' +
                            'docker-compose -f newman-prepare.docker-compose.yml up ' +
                            '--detach'

                    timeout(5) {
                        waitUntil {
                            "healthy" == sh(returnStdout: true,
                                    script: "docker inspect " + container_backend_name + " --format=\"{{ .State.Health.Status }}\"").trim()
                        }
                    }
                }
            }
        }
        //Needs to be in extra step, because the backend is creating the DB Schema
        stage('Newman - populate database') {
            steps {
                script {
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_I_main.sql'
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_II_calls-get-links.sql'
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_III_calls-get-statistics.sql'
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_IV_calls-noise.sql'
                }
            }
        }

        stage('Newman - execute') {
            steps {
                script {
                    // --mount (unlike -v) errors if the source is missing instead of creating an empty directory
                    def has_env = sh(returnStatus: true,
                            script: 'docker run --rm --mount type=bind,src=' + newman_env_file + ',dst=/env,readonly alpine:3 test -s /env') == 0

                    if (!has_env) {
                        echo "WARNING: Newman environment ${newman_env_file} not found - skipping API tests"
                        return
                    }

                    sh 'docker run ' +
                            '--mount type=bind,src=' + newman_env_file + ',dst=/etc/newman/environment.json.postman_environment,readonly ' +
                            '--name ' + container_newman_name + ' ' +
                            '--net ' + network_name + ' ' +
                            '-t postman/newman:alpine ' +
                            'run "https://raw.githubusercontent.com/sebamomann/dein-li-backend/' + commit_hash + '/test/collection/dein-li-swagger.postman_collection.json" ' +
                            '--environment="environment.json.postman_environment" ' +
                            '--env-var baseUrl=' + container_backend_name + ':3000 ' +
                            '-n 1 ' +
                            '--bail'
//                    sh 'NEWMAN_CONTAINER_NAME=' + container_newman_name + ' ' +
//                            'BACKEND_CONTAINER_NAME=' + container_backend_name + ' ' +
//                            'NETWORK_NAME=' + network_name + ' ' +
//                            'docker-compose -f newman-execute.docker-compose.yml up ' +
//                            '--detach'
//
//                    timeout(5) {
//                        waitUntil {
//                            "true" == sh(returnStdout: true,
//                                    script: "docker inspect " + container_backend_name + " --format=\"{{ .State.Running }}\"").trim()
//                        }
//                    }
//
//                    // running extra needed, otherwise pipeline will not fail on failed test
//                    sh 'docker exec -i ' + container_newman_name + ' ' +
//                            'run \"https://raw.githubusercontent.com/sebamomann/dein-li-backend/' + commit_hash + '/test/collection/dein-li-swagger.postman_collection.json\" ' +
//                            '--environment=\"environment.json.postman_environment\" ' +
//                            '--env-var baseUrl=' + container_backend_name + ':3000 ' +
//                            '-n 1 ' +
//                            '--bail'
                }
            }
        }

        stage('Deploy') {
            when {
                expression {
                    return branch_name == 'master'
                }
            }
            steps {
                script {
                    sh """
                        docker network create ${app_network} || true

                        # Keep the running container aside (stopped + renamed) so we can roll back
                        docker rm -fv ${app_container}-old || true
                        docker stop ${app_container} || true
                        docker rename ${app_container} ${app_container}-old || true

                        docker run -d \\
                            --name ${app_container} \\
                            --network ${app_network} \\
                            --restart unless-stopped \\
                            -p 127.0.0.1:${app_port}:3000 \\
                            -e TZ=Europe/Berlin \\
                            --mount type=bind,src=${app_env_file},dst=/app/.env,readonly \\
                            ${api_image_name}

                        deployed=0
                        for i in \$(seq 1 30); do
                            docker exec ${app_container} curl -fs localhost:3000/healthcheck > /dev/null 2>&1 && { deployed=1; break; }
                            sleep 2
                        done

                        if [ "\$deployed" != "1" ]; then
                            echo "New container failed health check - rolling back"
                            docker logs --tail 80 ${app_container} || true
                            docker rm -fv ${app_container} || true
                            docker rename ${app_container}-old ${app_container} || true
                            docker start ${app_container} || true
                            exit 1
                        fi

                        echo "Deploy healthy - removing previous container"
                        docker rm -fv ${app_container}-old || true
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    sh 'docker container rm ' + container_backend_name + ' -f -v'
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker container rm ' + container_newman_name + ' -f -v'
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker container rm ' + container_database_name + ' -f -v'
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker network rm ' + network_name
                } catch (err) {
                    echo err.getMessage()
                }

                // On master the image is now running in production - keep it
                if (branch_name != 'master') {
                    try {
                        sh 'docker image rm ' + api_image_name + ' -f'
                    } catch (err) {
                        echo err.getMessage()
                    }
                }
            }
        }
        success {
            script {
                updateStatus("success")

                try {
                    sh 'docker image prune --filter label=stage=intermediate -f'
                } catch (err) {
                    echo err.getMessage()
                }

                // Drop older images of this repo; docker refuses to remove the one the running container uses
                if (branch_name == 'master') {
                    sh "docker images dein-li/dein-li-backend --format '{{.Repository}}:{{.Tag}}' | grep -v ':${tag_name}\$' | xargs -r docker image rm || true"
                }
            }
        }
        failure {
            script {
                updateStatus("failure")
            }
        }
        aborted {
            script {
                updateStatus("error")
            }
        }
    }
}

void updateStatus(String value) {
    sh 'curl -s "https://api.github.com/repos/sebamomann/dein-li-backend/statuses/$GIT_COMMIT" \\\n' +
            '  -H "Content-Type: application/json" \\\n' +
            '  -H "Authorization: token $GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN" \\\n' +
            '  -X POST \\\n' +
            '  -d "{\\"state\\": \\"' + value + '\\", \\"description\\": \\"Jenkins\\", \\"context\\": \\"continuous-integration/jenkins\\", \\"target_url\\": \\"https://jenkins.dankoe.de/job/dein-li-backend/job/$BRANCH_NAME/$BUILD_NUMBER/console\\"}" \\\n' +
            '  '
}

