pipeline {

    agent any

    environment {
        IMAGE_NAME = "soumyajain9413/node-app-extended-2"
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Image') {
            steps {
                sh """
                /usr/local/bin/docker build \
                -t ${IMAGE_NAME}:${IMAGE_TAG} \
                app/
                """
            }
        }

        stage('Docker Version') {
            steps {
                sh """
                /usr/local/bin/docker images | head
                """
            }
        }

    }
}