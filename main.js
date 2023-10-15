const questions = [
  {
    title: ['WHAT IS YOUR AUDIENCE?'],
    questions: [
      'WHO ARE YOUR CUSTOMERS?',
      'ARE THERE ANY SPECIAL REQUIREMENTS LIKE TEHNOLOGY,LOCATION ETC?',
      'WHAT TYPES OF CUSTOMERS SHOULD BE EXCLUDED?',
      'WHAT ARE THE POSITIONS OF YOUR PROSPECTS?',
    ],
  },
]

// Finding elements
const headerContainer = document.querySelector('#header')
const listContainer = document.querySelector('#list')
const submitBtn = document.querySelector('#submit')

// Form Variables
let questionIndex = 0 // current question

clearPage()
showQuestion()
submitBtn.onclick = checkAnswer

function clearPage() {
  // headerContainer.innerHTML = ''
  listContainer.innerHTML = ''
}

function showQuestion() {
  console.log('showQuestion')
  // Question
  const headerTemplate = `<h2 class="title">%title%</h2>`
  const title = headerTemplate.replace(
    '%title%',
    questions[questionIndex]['title']
  )
  headerContainer.innerHTML = title

  // Questions form
  // let answerNumber = 1;
  for (questionText of questions[questionIndex]['questions']) {
    const questionTemplate = `
      <div class="card">
      	<li>
          <label>
           	<span>%question%</span>
            <form>
              <input type="text">
            </form>
          </label>
        </li>
      </div>`
    // We place a question in the template instead of labels
    const questionHTML = questionTemplate.replace('%question%', questionText)
    listContainer.innerHTML += questionHTML
  }
}

function checkAnswer() {
  // Выводим в консоль сообщение о том, что функция была вызвана.
  console.log('checkAnswer')

  // Getting all text input fields ('input[type="text"]') inside element 'listContainer'.
  const inputs = listContainer.querySelectorAll('input[type="text"]')

  // We initialize an empty array to store user responses.
  let answers = []

  // For each input field...
  inputs.forEach((input) => {
    // ...add the value of the input field to the response array.
    answers.push(input.value)
  })

  // We initialize an empty array to store response data.
  let answerData = []
  // Checking that responses are saved in the database
  let serverAnswer = true
  // For each question in the current list of questions...
  questions[questionIndex]['questions'].forEach((question, index) => {
    // ...add an object containing the question and the corresponding user answer to the 'answerData' array.
    answerData.push({
      question: question,
      answer: answers[index],
    })
  })

  // When the user clicks the submit button, the checkAnswer function is activated. This function collects all the user's answers, creating an answerData array, which consists of objects, each of which contains a question and the user's corresponding answer.
  // This array is then sent to the server at 'http://localhost:5500/submit' using the fetch method and the HTTP POST method. The server returns a response that is printed to the console.
  // The fetch method returns a Promise that resolves to a Response object representing the server response
  // Send a POST request to the URL 'http://localhost:5500/submit'.
  fetch('http://localhost:5500/submit', {
    method: 'POST', // Request method.
    headers: {
      'Content-Type': 'application/json', // A request header indicating that the request body contains JSON.
    },
    body: JSON.stringify({
      // Request body.
      answers: answerData, // Sent data.
    }),
  })
    .then((response) => response.json()) // Let's convert the server response to JSON.
    .then((data) => console.log(data, answerData), serverAnswer) // We output the received data to the console. Saving a variable for the report
    .catch((error) => console.error(error), (serverAnswer = false)) // In case of an error, we display an error message.

  clearPage()
  showResults()
}

function showResults() {
  console.log('showResults started!')

  const resultsTemplate = `
		<h2 class="title">%title%</h2>
		<h3 class="summary">%message%</h3>
		`

  let title, message

  //  Heading and text options
  if ((serverAnswer = true)) {
    title = 'Thank you!'
    message = 'The form has been sent'
  } else {
    title = 'Error'
    message = 'The form has not been sent'
  }

  // Final answer, substitute the data into the template
  const finalMessage = resultsTemplate
    .replace('%title%', title)
    .replace('%message%', message)

  headerContainer.innerHTML = finalMessage

  // Changing the button
  submitBtn.blur()
  submitBtn.innerText = 'Send again'
  // Page refresh after click
  submitBtn.onclick = () => history.go()
}
