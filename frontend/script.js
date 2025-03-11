const API_LINK = 'http://localhost:8000/api/v1/os-game/'

const left_container = document.querySelector('.left .container')
const left_title = document.querySelector('.left .title')

const right_container = document.querySelector('.right .container')
const right_title = document.querySelector('.right .title')

const frontFrame = document.getElementById('frontFrame')

function startHosting() {

    changeElements([left_container, right_container], () => {
        left_container.innerHTML = /* html */ `
        <div class='field' onclick='askForUsername()'>
        <p class='title'>Online</p>
        <p class='blackText subtitle'>
        Simple as ever.<br>For normal people<br><b>Just use this on<b>
        </p>
    </div>
        `

        right_container.innerHTML = /* html */ `
        <div class='field'>
            <p class='title'>Local</p>
            <p class='subtitle whiteText'>
            <a>Ollama</a> is requierd.<br>You need to install and run a <a>python script</a>.<br>
            <b>Still in development - currently not available</b>
            </p>
        </div>
        `
    })
}

function askForUsername() {

    console.log("host online")
    changeElements([frontFrame, left_container, right_container], () => {
        right_container.innerHTML = ``
        left_container.innerHTML = ``

        frontFrame.innerHTML += /* html */ `              
            <div class="inputFrame">
                <h4 id='enterUsernameLabel' class='titleBottomSpacing'>Enter your username below</h4>
                <input class="inputSource" id="username" type="text" placeholder="username">
                <button class="inputSource" onclick="host()">Host</button>
                <div><div>
            </div>
        `
    })
}

function host() {
    const value = document.getElementById('username').value

    if (value) {
        createLobby(value)
    } else {
        const label = document.getElementById('enterUsernameLabel')

        changeElements([label], () => {
            label.innerText = `Username mustn't be empty!`
            label.style = 'color:red;'
        })
    }
}

function createLobby(username) {
    const frame = document.querySelector('.inputFrame')
    let succes = false
    let id

    changeElements([frame], () => {
        frame.innerHTML = /* html */ `
        <h4>Loading...</h4>
        `
    })

    fetch(API_LINK + 'host', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username: username
        })
    })
        .then((result) => {
            if (!result.ok) {
                throw new Error(`HTTP Error! Status: ${result.status}`)
            }
            return result.json()
        })
        .then((result) => {
            if (result.status === 'succes') {
                succes = true
                id = result.id

                lobbyUI(id, username)
            } else {
                throw new Error('An error occured.')
            }
        })
        .catch((e) => {
            console.error(e)
            changeElements([frame], () => {
                frame.innerHTML = /* html */ `
                    <h4 style='color:red;'>${e}</h4>

                `
            })
        })
}


function lobbyUI(code, username) {
    changeElements([frontFrame, left_container, right_container], () => {
        frontFrame.innerHTML = /* html */ `
        <img src='VS.png' width=200px>
        `

        left_container.innerHTML = /* html */ `
            <h1 class="title">${username}<h1>
        `
    
        right_container.innerHTML = /* html */ `
            <p class='whiteText' style="padding:0;margin:0;">Join with code:<p>
            <h1 class="title" style="padding:0;margin:0;">${code}<h1>
        `
    })    
}

function changeElements(elements, change) {
    elements.forEach(element => {
        element.classList.add("fade-out")
    })

    setTimeout(() => {
        elements.forEach(element => {
            element.classList.remove("fade-out")
        })

        change()
        elements.forEach(element => {
            element.classList.add("fade-in")
        })

        setTimeout(() => {
            elements.forEach(element => {
                element.classList.remove("fade-in")
            })
        }, 500)
    }, 500)


}

function startJoining() {
    
}