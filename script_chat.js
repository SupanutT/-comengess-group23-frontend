const chatForm = document.getElementById('chat-form');
const popupBody = document.querySelector('.popup-body');
const popupContent = document.querySelector('.popup-content');
const overlay = document.querySelector('.overlay')
var chatData = []
var chatIntervalId = null;
var firstLoaded = null;

popup.style.display = "none"

document.getElementById("message").addEventListener("keydown", submitOnEnter);

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(chatForm);
    if (formData.get('message') !== '') {
        document.getElementById('message').value = '';
        
        postMessage(chatForm.id, formData.get('message'))
        firstLoaded = true;
    }
});

const postMessage = async (itemid, message) => {
    const itemToAdd = {
        userid: userid,
        userFullName: userFullName,
        itemid: itemid,
        message: message
    }

    const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToAdd)
    }

    await fetch(`http://${backendIPAddress}/chats`, options)
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
}

const getChatMessageByItemid = async (itemid) => {
    chatData = []
    const options = {
        method: "GET",
        credentials: "include"
    };

    await fetch(`http://${backendIPAddress}/chats`, options)
        .then((response) => response.json())
        .then((data) => {
            data.filter((data) => data.itemid === itemid)
                .map((data) => {
                    chatData.push({
                        created_date: data.created_date,
                        userid: data.userid,
                        userFullName: data.userFullName,
                        message: data.message
                    })
                })
        })
        .catch((error) => console.error(error));
        
    popupBody.innerHTML = '';
    chatData.sort((a, b) => a.created_date - b.created_date)
    let prev_user = '';
    let prev_timeString = '';
    for (let data in chatData) {
        const date = new Date(chatData[data].created_date)
        const options = { hour: 'numeric', minute: 'numeric' }
        const timeString = date.toLocaleTimeString([], options)
        if (prev_user !== chatData[data].userFullName || prev_timeString !== timeString) {
    
            const chatBox = document.createElement('div')
            chatBox.classList.add('chat-box')
    
            const infoText = document.createElement('div')
            infoText.classList.add('info-text')
    
            const usernameText = document.createElement('div')
            usernameText.classList.add('username-text')
            usernameText.innerHTML = chatData[data].userFullName
    
            const chatText = document.createElement('div')
            chatText.classList.add('chat-text')
            chatText.id = `${chatData[data].userFullName}-${timeString}`
            chatText.innerHTML = chatData[data].message
    
            const timeText = document.createElement('div')
            timeText.classList.add('time-text')
            timeText.innerHTML = timeString
    
            infoText.appendChild(usernameText)
            infoText.appendChild(timeText)
    
            chatBox.appendChild(infoText)
            chatBox.appendChild(chatText)
            popupBody.appendChild(chatBox)
        } else {
            const chatText = document.getElementById(`${prev_user}-${prev_timeString}`)
            chatText.innerHTML += `<br>${chatData[data].message}`
        }
        prev_user = chatData[data].userFullName
        prev_timeString = timeString
    }
    if (firstLoaded) {
        scrollToBottom()
        firstLoaded = false
    }
}

const popupDiv = (item) => {
    firstLoaded = true;
    overlay.style.display = 'block';
    clearInterval(chatIntervalId)
    const popupTitle = document.getElementById('popup-title')
    popupForm.id = item.itemid
    popupTitle.innerHTML = `${item.title} Chat Room`
    popup.style.display = "block";
    popupBody.innerHTML = '';
    getChatMessageByItemid(item.itemid);
    chatIntervalId = setInterval(() => {
        if (chatData !== []) {
            getChatMessageByItemid(item.itemid);
        }
    }, 1000)
}


closeBtn.onclick = function () {
    closePopup();
}

function closePopup () {
    popup.style.display = "none";
    overlay.style.display = 'none';
    chatData = []
    popupBody.innerHTML = '';
    clearInterval(chatIntervalId)
}

function scrollToBottom() {
    popupBody.scrollTop = popupBody.scrollHeight - popupBody.clientHeight;
}

function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
        if (!event.repeat) {
            const newEvent = new Event("submit", {cancelable: true});
            event.target.form.dispatchEvent(newEvent);
        }
        event.preventDefault(); 
    }
}

window.addEventListener('click', function(e){   
    if (overlay.contains(e.target)){
      closePopup();
    } else{
        // do-nothing
    }
  });