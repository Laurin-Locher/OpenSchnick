const API_LINK = 'https://openschnick.onrender.com/api/v1/os-game/'

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
    const label = document.getElementById('enterUsernameLabel')


    if (value.length > 7) {
        changeElements([label], () => {
            label.innerText = `Username to long! Max 7 letters.`
            label.style = 'color:red;'
        })
    } else if (value) {
        createLobby(value)
    }
    else {

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

function connectHost(id) {
    fetch(API_LINK + 'connectHost/' + id)
}

function lobbyUI(code, username) {
    changeElements([frontFrame, left_container, right_container], () => {
        addVS()

        left_container.innerHTML = /* html */ `
            <h1 class="title">${username}<h1>
        `

        right_container.innerHTML = /* html */ `
            <p class='whiteText' style="padding:0;margin:0;">Join with code:<p>
            <h1 class="title" style="padding:0;margin:0;">${code}<h1>
        `
    })

    connectHost(code)

    // wait for user to join
    const eventSource = new EventSource(API_LINK + 'connectHost/' + code)
    eventSource.onmessage = function(event) {
        const lobby = JSON.parse(event.data);
        console.log('Received data:', lobby);

        right_container.innerHTML = /* html */ `
            <h1 class="title">${lobby.guestUsername}<h1>
        `
    }
}

function addVS() {
    frontFrame.innerHTML = /* html */ `
        <img src='VS.png' width=200px>
        `
}

function startJoining() {
    console.log('start join')
    changeElements([frontFrame, left_container, right_container], () => {
        right_container.innerHTML = ``
        left_container.innerHTML = ``

        frontFrame.innerHTML += /* html */ `              
            <div class="inputFrame">
                <h4 id='enterStuffLabel'>Enter code and username</h4>
                <input class="inputSource" id="id" type="text" placeholder="Enter code">
                <br>
                <input class="inputSource" id="username" type="text" placeholder="username">
                <br>
                <button class="inputSource" onclick="join()" style="margin-top:10px;">Join</button>
                <div><div>
            </div>
        `
    })
}

function join() {
    const username = document.getElementById('username').value
    const id = document.getElementById('id').value
    const label = document.getElementById('enterStuffLabel')

    if (!username) {
        label.innerText = `Username mustn't be empty.`
        label.style = `color:red;`

        return;
    } else if (!id) {
        label.innerText = `Code mustn't be empty`
        label.style = `color:red;`

        return;
    } else {
        label.innerText = `Loading...`
        label.style = `color:black;`

        fetch(API_LINK + 'join/' + id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username: username
            })
        }).then((res) => res.json())
            .then((res) => {
                console.log(res)

                switch (res.status) {
                    case 'id not found':
                        label.innerText = `Code not found`
                        label.style = `color:red;`
                        return

                    case 'succes':
                        label.innerText = 'Joined'
                        label.style = `color:black;`
                        guestLobbyUI(res.lobby)
                        return

                    default:
                        label.innerText = `Unknown error`
                        label.style = `color:red;`
                        return

                }
            })
    }
}

function guestLobbyUI(lobby) {
console.log(lobby)

    addVS()

    left_container.innerHTML = /* html */ `
        <h1 class="title">${lobby.username}<h1>
    `

    right_container.innerHTML = /* html */ `
    <h1 class="title">${lobby.guestUsername}<h1>

    `
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
