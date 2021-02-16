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
                    sh 'NEWMAN_CONTAINER_NAME=' + container_newman_name + ' ' +
                            'COMMIT_HASH=' + commit_hash + ' ' +
                            'BACKEND_CONTAINER_NAME=' + container_backend_name + ' ' +
                            'NETWORK_NAME=' + network_name + ' ' +
                            'docker-compose -f newman-execute.docker-compose.yml up'
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

