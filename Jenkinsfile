pipeline {
    agent any

    environment {
        AWS_REGION        = 'ap-south-1'
        ECR_REGISTRY      = credentials('ecr-registry-url')
        IMAGE_TAG         = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE    = "${ECR_REGISTRY}/portfolio-frontend"
        BACKEND_IMAGE     = "${ECR_REGISTRY}/portfolio-backend"
        KUBECONFIG_CRED   = 'kubeconfig-eks'
        AWS_CREDS         = credentials('aws-credentials')
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo '🔨 Building ASP.NET Core backend...'
                dir('backend') {
                    sh 'dotnet restore PortfolioApi/PortfolioApi.csproj'
                    sh 'dotnet build PortfolioApi/PortfolioApi.csproj -c Release --no-restore'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo '🧪 Running unit tests...'
                dir('backend') {
                    sh '''
                        if [ -d "PortfolioApi.Tests" ]; then
                            dotnet test PortfolioApi.Tests/ --no-build -c Release \
                                --logger "trx;LogFileName=test-results.trx"
                        else
                            echo "No test project found — skipping"
                        fi
                    '''
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: '**/test-results.trx', allowEmptyResults: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker images...'
                sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend"
                sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG}  -t ${BACKEND_IMAGE}:latest  ./backend"
            }
        }

        stage('Push to ECR') {
            steps {
                echo '📦 Pushing images to AWS ECR...'
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REGISTRY}

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                echo '☸️ Deploying to Kubernetes (EKS)...'
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                    sh '''
                        helm upgrade --install portfolio ./helm/portfolio \
                            --namespace portfolio \
                            --create-namespace \
                            --set frontend.image=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                            --set backend.image=${BACKEND_IMAGE}:${IMAGE_TAG} \
                            --set backend.env.DB_HOST=${DB_HOST} \
                            --set backend.env.DB_NAME=${DB_NAME} \
                            --set backend.env.DB_USER=${DB_USER} \
                            --set backend.env.DB_PASSWORD=${DB_PASSWORD} \
                            --wait --timeout=5m
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                echo '✅ Verifying deployment health...'
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl rollout status deployment/portfolio-frontend -n portfolio --timeout=3m
                        kubectl rollout status deployment/portfolio-backend  -n portfolio --timeout=3m
                        echo "Deployment successful!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed — check logs above'
            // Add Slack/email notification here
        }
        always {
            sh 'docker image prune -f'
        }
    }
}
