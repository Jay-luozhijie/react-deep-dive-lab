let hooks = []
let currentHook = 0


function useState(initialValue) {
    const hookIndex = currentHook    
    hooks[hookIndex] = hooks[hookIndex] || initialValue

    function setState(input) {
        if (typeof input === 'function') {
            hooks[hookIndex] = input(hooks[hookIndex])
        } else {
            hooks[hookIndex] = input
        }
        render()
    }
    currentHook++
    return [hooks[hookIndex], setState]
}

function App() {
    const [count, setCount] = useState(0)
    const [text, setText] = useState('hello')

    console.log('App render', count)
    console.log('App render', text)
    
    return {
        onClickFunction() {
            setCount(prev => prev + 1)
        },
        onChangeText(newText) {
            setText(newText)
        }
    }
}

let app;

function render() {
    currentHook = 0
    console.log('Render App Start')
    app = App()
    console.log('Render App End')
}

render()

app.onClickFunction()
app.onClickFunction()  
app.onChangeText('world')

// app.onClickFunction()
// app.onClickFunction()
// app.onClickFunction()


