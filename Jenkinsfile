pipeline {

    agent any

    stages {

        stage('Debug Docker') {

            steps {

                sh '''
                echo "PATH=$PATH"

                which docker || true

                /usr/local/bin/docker version
                '''

            }

        }

    }

}