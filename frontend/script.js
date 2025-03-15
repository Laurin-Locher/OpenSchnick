const API_LINK = 'https://openschnick-1.onrender.com/api/v1/os-game/'

const left_container = document.querySelector('.left .container')
const left_title = document.querySelector('.left .title')

const right_container = document.querySelector('.right .container')
const right_title = document.querySelector('.right .title')

const frontFrame = document.getElementById('frontFrame')

let eventSource

function startHosting() {

    askForUsername()

    // changeElements([left_container, right_container], () => {
    //     left_container.innerHTML = /* html */ `
    //     <div class='field' onclick='askForUsername()'>
    //     <p class='title'>Online</p>
    //     <p class='blackText subtitle'>
    //     Simple as ever.<br>For normal people<br><b>Just use this on<b>
    //     </p>
    // </div>
    //     `

    //     right_container.innerHTML = /* html */ `
    //     <div class='field'>
    //         <p class='title'>Local</p>
    //         <p class='subtitle whiteText'>
    //         <a>Ollama</a> is requierd.<br>You need to install and run a <a>python script</a>.<br>
    //         <b>Still in development - currently not available</b>
    //         </p>
    //     </div>
    //     `
    // })
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

function connectGuest(id) {
    fetch(API_LINK + 'connectGuest/' + id)
}

function lobbyUI(id, username) {
    changeElements([frontFrame, left_container, right_container], () => {
        addVS()

        left_container.innerHTML = /* html */ `
            <h1 class="title">${username}<h1>
        `

        right_container.innerHTML = /* html */ `
            <p class='whiteText' style="padding:0;margin:0;">Join with code:<p>
            <h1 class="title" style="padding:0;margin:0;">${id}<h1>
        `
    })


    // wait for user to join
    eventSource = new EventSource(API_LINK + 'connectHost/' + id)
    eventSource.onmessage = function (event) {
        const lobby = JSON.parse(event.data);
        console.log('Received data:', lobby);

        right_container.innerHTML = /* html */ `
            <h1 class="title">${lobby.guestUsername}<h1>
        `

        fetch(API_LINK + 'start/' + id)
            .then((res => res.json()))
            .then((res) => {
                console.log(res)
                const waitTime = res.startTime - Date.now()

                console.log('host wait' + waitTime)
                setTimeout(() => {
                    hostGameUI(id)
                }, waitTime)
            })
    }
}

function startHostGame() {
    left_container.innerHTML = `<p>game starts</p>`
    right_container.innerHTML = `<p>game starts</p>`
}

function addVS() {
    frontFrame.innerHTML = /* html */ `
        <img src='VS.png', class="vs" id="vs">
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
                        console.log(id)
                        guestLobbyUI(res.lobby, id)
                        return

                    default:
                        label.innerText = `Unknown error`
                        label.style = `color:red;`
                        return

                }
            })
    }
}

function guestLobbyUI(lobby, id) {

    addVS()

    left_container.innerHTML = /* html */ `
        <h1 class="title">${lobby.username}<h1>
    `

    right_container.innerHTML = /* html */ `
    <h1 class="title">${lobby.guestUsername}<h1>
     `

    eventSource = new EventSource(API_LINK + 'connectGuest/' + id)

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        const startTime = data.startTime
        const waitTime = startTime - Date.now()
        console.log('wait ' + waitTime)

        if (waitTime > 0) {
            setTimeout(() => {
                guestGameUI(id)
            }, waitTime)
        } else {
            guestGameUI(id)
        }
    }

    eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
    }

}

function guestGameUI(id) {
    console.log('ggUI' + id)
    left_container.innerHTML = /* html */ `
    <h1 class='title'>Typing...</h1>
    `
    right_container.innerHTML = /* html */ `
    <input type="text" placeholder="Magic Word" id="GuestWord" class="magicWord whiteText">
    <br>
    <button onclick="logInGuest('${id}')">Log In</button>
    `
}


function logInGuest(id) {
    const word = document.getElementById("GuestWord").value

    if (!word) {
        return
    }

    changeElements([right_container], () => {
        right_container.innerHTML = /* html */ `
        <h1 class="title">${word}<h1>
    `
    })

    console.log(id)

    fetch(API_LINK + `logInGuest/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            word: word
        })
    })
        .then(res => res.json())
        .then(res => { console.log(res) })

    eventSource.onmessage = (event) => {
        waitForResult()

        const hword = event.data
        left_container.innerHTML = /* html */ `
            <h1 class="title">${hword}<h1>
        `
    }
}

function hostGameUI(id) {
    left_container.innerHTML = /* html */ `
    <input type="text" placeholder="Magic Word" id="HostWord" class="magicWord">
    <br>
    <button onclick="logInHost(${id})">Log In</button>
    `
    right_container.innerHTML = /* html */ `
    <h1 class='title whiteText'>Typing...</h1>
    `
}

function logInHost(id) {
    const word = document.getElementById("HostWord").value

    if (!word) {
        return
    }

    changeElements([left_container], () => {
        left_container.innerHTML = /* html */ `
        <h1 class="title">${word}<h1>
    `
    })

    console.log(id)

    fetch(API_LINK + `logInHost/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            word: word
        })
    }).then(res => res.json)
        .then(res => { console.log(res) })

    eventSource.onmessage = (event) => {
        waitForResult()

        changeElements([right_container], () => {
            const gword = event.data
            right_container.innerHTML = /* html */ `
            <h1 class="title">${gword}<h1>
        `
        })

    }
}

function waitForResult() {
    frontFrame.classList.add("fullWindow")
    frontFrame.innerHTML += /* html */ `
    <div class='inputFrame resultFrame' id='resultFrame'>
        <p id='result' class="result"></p>
    </div>
    `
    const resultFrame = document.getElementById('resultFrame')
    resultFrame.style = "display: none; opacity:0"
    const result = document.getElementById("result")
    const vs = document.getElementById("vs")


    eventSource.onmessage = (event) => {
        const data = event.data
        if (data.replace(/\s/g, "")) {
            changeElements([frontFrame], () => {
                vs.style = "display: none;"
                resultFrame.style = "display:flex;"
            })
        }
        result.innerText += data
    }
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
