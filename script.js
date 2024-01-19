// Function to fetch and parse the XML file
function loadXML() {
  fetch("./quiz.xml") // Replace with the correct path to your XML file
    .then((response) => response.text())
    .then((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      displayQuiz(xmlDoc);
    })
    .catch((error) => console.error("Error loading XML:", error));
}

// Function to display the quiz questions and answers
// Function to display the quiz questions and answers
function displayQuiz(xmlDoc) {
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

    // Iterate through each answer
    const answers = questionBlock.getElementsByTagName("Answer");
    Array.from(answers).forEach((answer) => {
      const isCorrect = answer.getAttribute("IsCorrect") === "Yes";
      const answerContent =
        answer.querySelector("Content PlainText").textContent;

      // Create a div for the answer
      const answerDiv = document.createElement("div");
      answerDiv.innerHTML = `${
        isCorrect ? "[Correct]" : "[Incorrect]"
      } ${answerContent}`;

      // Add light green background to correct answers
      if (isCorrect) {
        answerDiv.style.backgroundColor = "#c8e6c9"; // Light green color
        answerDiv.style.marginBottom = "3px"; // Light green color
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

// Call the loadXML function when the page loads
window.onload = loadXML;

// Call the loadXML function when the page loads
window.onload = loadXML;
