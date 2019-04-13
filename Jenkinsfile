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
        input(message: 'Sure to do?', id: '1', ok: '2', submitter: '3', submitterParameter: '4')
      }
    }
  }
}