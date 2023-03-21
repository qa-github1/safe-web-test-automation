pipeline {
  agent {
    node {
      label 'Django'
    }
  }
  stages {

    //stage('Preparation') {
    // steps {
    // git credentialsId: '7f425df4-0804-4ded-94c8-a75a4b23572e', url: 'https://github.com/TrackerProducts/safe-e2e-tests.git'
    //  echo "Repository updated"
    // }
    // }

    stage('Dockerizing') {
      steps {
        sh label: 'Remove previous container', script: "docker rm -f cypress-tracker-image || true;"

        sh label: 'Pull new container', returnStdout: true, script: "docker pull trackerproducts2/tracker-2022"

        sh label: 'Run the container', returnStdout: true, script: "docker run --privileged -t -d --name cypress-tracker-image trackerproducts2/tracker-2022;"

        sh label: 'Run test in docker', returnStdout: true, script: "docker exec --privileged  cypress-tracker-image bash -c 'cd safe-e2e-tests && npm run cypress:headlessChrome'"
      }
    }
  }

  post {
    always {

      sh label: 'Copy report from container', returnStdout: true, script: "docker cp cypress-tracker-image:/safe-e2e-tests/report ./"
      allure includeProperties: false, jdk: 'JAVA_HOME', report: 'report/allure-report', results: [
        [path: 'report/allure-results']
      ]
    }
    failure {
      slackSend channel: '#e2e-tests', color: '#E4162F'
      message: "Some automated tests have failed. Please check out the report here ---> http://spaceballs.trackerproducts.com:8080/job/Safe%20Nightly%20E2E%20Testing%20V2.0/${env.BUILD_NUMBER}/allure/ "
    }

    success {
      slackSend channel: '#e2e-tests', color: '#04A51C'
      message: "All automated tests have passed. Please check out the report here ---> http://spaceballs.trackerproducts.com:8080/job/Safe%20Nightly%20E2E%20Testing%20V2.0/${env.BUILD_NUMBER}/allure/ "
    }
  }
}
