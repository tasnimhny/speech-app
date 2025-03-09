---

# 🗣️ Speech Extension - VS Code Extension  

A **VS Code extension** that enables developers to **speak their code** and perform modifications using voice commands. This tool improves accessibility and efficiency by allowing hands-free coding and seamless voice-to-text integration.  

## 🚀 Features  

- 🎙️ **Speak Code** – Convert spoken words into code using speech-to-text.  
- ✏️ **Modify Code via Voice** – Edit, delete, and manipulate code using natural language commands.  
- 📢 **Text-to-Speech** – Read code aloud for better accessibility and review.  
- 🎯 **Hands-Free Coding** – Reduce reliance on keyboard input and improve workflow.  
- 🌐 **Multi-Language Support** (Coming Soon) – Support for multiple programming languages.  

## 🛠️ Installation  

### Install from VS Code Marketplace  
(Coming Soon: Add link here when available)  

### Install Manually  
1. **Clone the Repository:**  
   ```sh
   git clone https://github.com/tasnimhny/speech-app.git
   cd speech-app
   ```  
2. **Install Dependencies:**  
   ```sh
   npm install
   ```  
3. **Build the Extension:**  
   ```sh
   npm run build
   ```  
4. **Launch in VS Code:**  
   - Open the project in VS Code.  
   - Press `F5` to run the extension in a new VS Code window.  

## 📚 Usage  

1. **Activate the Extension:**  
   - Use the command **"Start Speech Mode"** from the VS Code Command Palette (`Ctrl + Shift + P`).  
   - Alternatively, use a **custom keyboard shortcut** or a dedicated **voice command activation** (if configured).  

2. **Speak Your Code:**  
   - Say a programming statement, and it will be converted into text in your active editor.  
   - Example: _"Define a function called add that takes two arguments"_ →  
     ```js
     function add(a, b) {
         return a + b;
     }
     ```  

3. **Modify Code via Voice:**  
   - Example Commands:  
     - _"Delete line 10"_ → Removes line 10.  
     - _"Change let to const on line 5"_ → Modifies `let` to `const` on line 5.  
     - _"Read this function aloud"_ → Uses text-to-speech to read the function.  

4. **Stop Speech Recognition:**  
   - Say _"Stop listening"_ or use the **Stop Speech Mode** command in the Command Palette.  

## 🤖 Technologies Used  

- **VS Code API** – For building the extension.  
- **Web Speech API** – For speech recognition and text-to-speech.  
- **Node.js** – Handles backend processing.
- **Firebase** - For our website to track users
- **Tailwind** - Decorate our front-end

## 🔧 Future Improvements  

- 📜 **Support for More Programming Languages** (Currently supports JavaScript, Python, and C++)  
- 🎚️ **Customizable Voice Commands**  
- 🤖 **AI-powered Code Assistance**  
- 🌍 **Multi-Language Speech Recognition**  

## 🤝 Contributing  

Contributions, issues, and feature requests are welcome!  

1. Fork the repo.  
2. Create a feature branch (`git checkout -b feature-branch`).  
3. Commit changes (`git commit -m "Add new feature"`).  
4. Push to the branch (`git push origin feature-branch`).  
5. Open a pull request.  

## 📄 License  

This project is open-source and available under the [MIT License](LICENSE).  

---
