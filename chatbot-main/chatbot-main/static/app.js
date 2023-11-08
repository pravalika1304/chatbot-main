class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox,text1="") {
      var textField = chatbox.querySelector('input');
        if(text1==""){
          text1 = textField.value;
        }
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "HosBot", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }
    updateChatText(chatbox) {
        const messageContainer = chatbox.querySelector('.chatbox__messages');
      
        // Clear existing content
        messageContainer.innerHTML = '';
      
        // Loop through each message
        this.messages.slice().reverse().forEach((item, index) => {
          let messageHtml = '';
          if (item.name === 'HosBot') {
            if (Array.isArray(item.message)) {
              // If the message is a list, create separate textboxes for each element
              item.message.forEach((element) => {
                let newclass="";
                if(element.includes("Q."))
                    newclass="clickable";
                messageHtml = `<div class="messages__item messages__item--visitor ${newclass}">${element}</div>`+messageHtml;
              });
            } else {
              // If the message is not a list, display it in a single textbox
              messageHtml = `<div class="messages__item messages__item--visitor">${item.message}</div>`;
            }
          } else {
            messageHtml = `<div class="messages__item messages__item--operator">${item.message}</div>`;
          }
          messageContainer.innerHTML += messageHtml;
          reClick();
        });
      
        // Scroll to the bottom of the message container
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
      
}


const chatbox = new Chatbox();
chatbox.display();

function reClick() {
  const chatboxt = document.querySelector('.chatbox__support');
  const clickable = chatboxt.querySelectorAll('.clickable');

  clickable.forEach(item => {
    console.log("loop workinng")
    item.addEventListener('click', ()=> {
      console.log(item.innerHTML);
      chatbox.onSendButton(chatboxt,item.innerHTML);
    });
  });
}

