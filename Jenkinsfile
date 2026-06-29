pipeline {

    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
        IMAGE_NAME = "soumyajain9413/node-app-extended-2"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Image') {

            steps {

                sh '''
                echo $PATH

                which docker
                which docker-credential-desktop

                docker build \
                -t ${IMAGE_NAME}:${IMAGE_TAG} \
                app/
                '''

            }

        }

    }
}