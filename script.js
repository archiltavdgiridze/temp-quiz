// Function to fetch and parse the XML file
function loadXML() {
  fetch("./quiz.xml") // Replace with the correct path to your XML file
    .then((response) => response.text())
    .then((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      setupQuiz(xmlDoc);
    })
    .catch((error) => console.error("Error loading XML:", error));
}

// Function to setup the quiz based on the mode
function setupQuiz(xmlDoc) {
  const quizContainer = document.getElementById("quizContainer");

  // Define quiz mode
  let quizMode = "learning"; // Default to learning mode

  // Function to toggle between learning and quiz modes
  function toggleMode() {
    quizMode = quizMode === "learning" ? "quiz" : "learning";
    quizContainer.innerHTML = ""; // Clear existing content
    displayQuiz(xmlDoc, quizMode);
    // Update button text based on the current mode
    toggleButton.textContent =
      quizMode === "learning" ? "Quiz Mode" : "Learning Mode";
  }

  // Create a button to toggle modes
  const toggleButton = document.getElementById("toggleButton");
  toggleButton.id = "toggleButton";
  toggleButton.textContent = "Quiz Mode"; // Initial text
  toggleButton.addEventListener("click", toggleMode);
  document.body.insertBefore(toggleButton, quizContainer);

  // Display quiz in the initial mode
  displayQuiz(xmlDoc, quizMode);
}

// Function to display the quiz questions and answers
function displayQuiz(xmlDoc, mode) {
  const quizContainer = document.getElementById("quizContainer");

  // Iterate through each question block
  const questionBlocks = xmlDoc.getElementsByTagName("QuestionBlock");
  Array.from(questionBlocks).forEach((questionBlock, index) => {
    const questionType =
      questionBlock.querySelector("QuestionTypeName").textContent;
    const questionContent =
      questionBlock.querySelector("Content PlainText").textContent;

    // Create a div for the question with a question number
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `<strong> ${
      index + 1
    } კითხვა :</strong> ${questionContent}`;

    // Add a 20px bottom margin to create a gap between questions
    questionDiv.style.marginBottom = "5px";

    quizContainer.appendChild(questionDiv);

    // Create an array to store answers
    const answers = Array.from(questionBlock.getElementsByTagName("Answer"));

    // Shuffle answers in quiz mode
    const shuffledAnswers = mode === "quiz" ? shuffleAnswers(answers) : answers;

    // Create an array to store correct answers
    const correctAnswers = shuffledAnswers.filter(
      (answer) => answer.getAttribute("IsCorrect") === "Yes"
    );

    // Iterate through each answer
    shuffledAnswers.forEach((answer) => {
      const isCorrect = answer.getAttribute("IsCorrect") === "Yes";
      const answerContent =
        answer.querySelector("Content PlainText").textContent;

      // Create a div for the answer
      const answerDiv = document.createElement("div");

      answerDiv.innerHTML =
        mode === "learning"
          ? `${isCorrect ? "[სწორია]" : "[არასწორია]"} ${answerContent}`
          : `${answerContent}`;

      // Add light green background to correct answers in learning mode
      if (mode === "learning" && isCorrect) {
        answerDiv.style.backgroundColor = "#c8e6c9"; // Light green color
        answerDiv.style.marginBottom = "3px";
      }

      quizContainer.appendChild(answerDiv);
    });

    // Add a 20px bottom margin after the answers
    if (index < questionBlocks.length - 1) {
      const spacerDiv = document.createElement("div");
      spacerDiv.style.height = "30px";
      quizContainer.appendChild(spacerDiv);
    }
  });
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleAnswers(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Call the loadXML function when the page loads
window.onload = loadXML;
