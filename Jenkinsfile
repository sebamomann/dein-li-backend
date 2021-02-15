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


pipeline {
    agent any

    environment {
        GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN = credentials('GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN')
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Preamble') {
            steps {
                script {
                    updateStatus("pending")
                    commit_hash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    echo "COMMIT HASH: ${commit_hash}"
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

        stage('Newman prepare') {
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
                        'docker-compose -f mysql.docker-compose.yml up ' +
                        '--detach'
//                            '' +
//                            '' +
//                            ' run -d ' +
//                            '--name ' + container_database_name + ' ' +
//                            '--env MYSQL_ROOT_PASSWORD=password ' +
//                            '--env MYSQL_USER=user ' +
//                            '--env MYSQL_PASSWORD=password ' +
//                            '--env MYSQL_DATABASE=dein-li-newman ' +
//                            '--network ' + network_name + ' ' +
//                            '--health-cmd=\'mysqladmin ping --silent\' ' +
//                            'mariadb:10.3 '
//                            'mysqld --default-authentication-plugin=mysql_native_password'
//
//                    timeout(60) {
//                        waitUntil {
//                            "healthy" == sh(returnStdout: true,
//                                    script: "docker inspect " + container_database_name + " --format=\"{{ .State.Health.Status }}\"").trim()
//                        }
//                    }

//                    sh 'docker run -d ' +
//                            '--name ' + container_backend_name + ' ' +
//                            '--env SALT_JWT=salt ' +
//                            '--env SALT_MAIL=salt ' +
//                            '--env API_URL=' + container_backend_name + ':3000 ' +
//                            '--env DB_USERNAME=user ' +
//                            '--env DB_PASSWORD=password ' +
//                            '--env DB_HOST=' + container_database_name + ' ' +
//                            '--env DB_PORT=3306 ' +
//                            '--env DB_DATABASE=dein-li-newman ' +
//                            '--env NODE_ENV=newman ' +
//                            '--env KEYCLOAK_URL=https://account.sebamomann.de ' +
//                            '--env KEYCLOAK_REALM=test ' +
//                            '--env KEYCLOAK_CLIENT-ID=test ' +
//                            '--network ' + network_name + ' ' +
//                            '--health-cmd=\'curl localhost:3000/healthcheck || exit 1 \' ' +
//                            '--health-interval=2s ' +
//                            'dein-li/dein-li-backend:' + tag_name
//
//                    timeout(5) {
//                        waitUntil {
//                            "healthy" == sh(returnStdout: true,
//                                    script: "docker inspect " + container_backend_name + " --format=\"{{ .State.Health.Status }}\"").trim()
//                        }
//                    }

                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_I_main.sql'
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_II_calls-get-links.sql'
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_III_calls-get-statistics.sql'
                    sh 'docker exec -i ' + container_database_name + ' mysql -uuser -ppassword dein-li-newman < $(pwd)/test/testdata/data_IV_calls-noise.sql'
                }
            }
        }

        stage('Newman exec') {
            steps {
                script {
//                    def environmentVars = readFile file: "/var/www/vhosts/sebamomann.dankoe.de/testing.dein.li/dein-li-newman.postman_environment"
//                    environmentVars = environmentVars.replaceAll("{{baseUrl}}", container_backend_name)
//                    writeFile file: "./dein-li-newman.postman_environment", text: environmentVars
//                    sh 'docker run ' +
//                            '-v /var/www/vhosts/sebamomann.dankoe.de/testing.dein.li/dein-li-newman.postman_environment:/etc/newman/environment.json.postman_environment ' +
//                            '--name ' + container_newman_name + ' ' +
//                            '-p 3000:3000 ' +
//                            '--net ' + network_name + ' ' +
//                            '-t postman/newman:alpine ' +
                    timeout(60) {
                        waitUntil {
                            "healthy" == sh(returnStdout: true,
                                    script: "docker inspect " + container_newman_name + " --format=\"{{ .State.Health.Status }}\"").trim()
                        }
                    }

                    sh 'docker exec -i ' + container_newman_name + ' ' +
                            'run "https://raw.githubusercontent.com/sebamomann/dein-li-backend/' + commit_hash + '/test/collection/dein-li-swagger.postman_collection.json" ' +
                                '--environment="environment.json.postman_environment" ' +
                                '--env-var baseUrl=' + container_backend_name + ':3000 ' +
                                '-n 1 ' +
                                '--bail'
                }
            }
        }

        stage('Publish to registry') {
            when {
                expression {
                    return branch_name =~ /^\d\.\d\.\d(-\d+)?/
                }
            }
            steps {
                script {
                    docker.withRegistry('http://localhost:34015') {
                        image.push(branch_name)
                    }
                }
            }
        }

        stage('Publish to registry - master') {
            when {
                expression {
                    return branch_name =~ "master"
                }
            }
            steps {
                script {
                    docker.withRegistry('http://localhost:34015') {
                        image.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    sh 'docker container rm ' + container_backend_name + ' -f'
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker container rm ' + container_newman_name + ' -f'
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker container rm ' + container_database_name + ' -f'
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker network rm ' + network_name
                } catch (err) {
                    echo err.getMessage()
                }

                try {
                    sh 'docker image rm ' + api_image_name + ' -f'
                } catch (err) {
                    echo err.getMessage()
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

