pipeline {

    agent any

    environment {
        IMAGE_NAME = "soumyajain9413/node-app-extended-2"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh """
                docker build \
                -t ${IMAGE_NAME}:${IMAGE_TAG} \
                app/
                """
            }
        }

        stage('Docker Login') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh """
                    echo \$DOCKER_PASS | docker login \
                    -u \$DOCKER_USER \
                    --password-stdin
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                sh """
                docker push ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy') {
            steps {

                sh """
                kubectl set image deployment/node-app \
                node-app=${IMAGE_NAME}:${IMAGE_TAG}

                kubectl rollout status deployment/node-app
                """
            }
        }
    }
}