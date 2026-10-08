pipeline {
    agent any

    environment {
        // Cấu hình môi trường (nếu cần)
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Kéo code mới nhất từ GitHub
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Cài đặt thư viện Node.js. 
                // Lưu ý: Nếu Jenkins chạy trên Windows, dùng 'bat' thay vì 'sh'
                bat 'npm install' 
                // sh 'npm install' (Dùng dòng này nếu Jenkins chạy trên Linux/Docker)
            }
        }

        stage('Test') {
            steps {
                // Chạy Unit Test (hiện tại dự án chưa có test nên để echo)
                echo 'Skipping tests - No tests configured yet.'
            }
        }

        stage('Deploy') {
            steps {
                // Sử dụng npx pm2 để tránh lỗi không nhận diện được lệnh pm2 trong môi trường Jenkins
                bat 'npx pm2 restart fashion-store || npx pm2 start server.js --name "fashion-store"'
                
                // Nếu Jenkins chạy trên Linux:
                // sh 'npx pm2 restart fashion-store || npx pm2 start server.js --name "fashion-store"'
            }
        }
    }

    post {
        always {
            echo 'Quy trình Pipeline đã hoàn tất.'
        }
        success {
            echo '🎉 Deploy thành công!'
        }
        failure {
            echo '❌ Có lỗi xảy ra trong quá trình Deploy.'
        }
    }
}
