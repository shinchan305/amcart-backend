pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
    }
    stages {
         stage('Build') { 
            steps { 
                script{
                 app = docker.build("amcart-product")
                }
            }
        }
        stage('Test'){
            steps {
                 echo 'Empty'
            }
        }
        stage('Deploy') {
            steps {
                script{
                        docker.withRegistry('https://gallery.ecr.aws/z4m1p6s9', 'ecr:us-east-2:aws-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
    }
}