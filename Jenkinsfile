pipeline {
  agent any
  stages {
    stage('sleep') {
      steps {
        sleep 5
      }
    }
    stage('interactive') {
      steps {
        input(message: 'Sure to do?', ok: 'OK')
      }
    }
  }
}