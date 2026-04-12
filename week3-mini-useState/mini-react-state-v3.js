let state;
let hooks = []
let currentHook = 0
let queue = []
let isRendering = false

function scheduleRender(){
    if (!isRendering) {
        isRendering = true
        Promise.resolve().then(() =>{
            queue.map(fn => fn())
            queue = []
            render()
            isRendering = false
        })
    }
}

function useState(initialValue) {
    const hookIndex = currentHook
    hooks[hookIndex] = hooks[hookIndex] || initialValue
    const setState = newValue => {
        console.log('setState called with', newValue)
        queue.push(() => {
            console.log('Updating state at hook index', hookIndex)
            hooks[hookIndex] = typeof newValue === 'function' ? newValue(hooks[hookIndex]) : newValue
        })
        scheduleRender()
    }
    currentHook++
    return [hooks[hookIndex], setState]

}

function App() {
    const [count, setCount] = useState(0)
    const [name, setName] = useState('Tom')

    console.log('App render', count, name)
    return {
        onClickFunction() {
            setCount(prev => prev + 1)
        },
        onClickName(){
            setName(prev => prev + 'A')
        }
    }
}

let app;

function render() {
    console.log('Render App Start')
    currentHook = 0

    app = App()
    console.log('Render App End')
}

render()

app.onClickFunction()


app.onClickName()

app.onClickFunction()

app.onClickName()  

await new Promise(resolve => setTimeout(resolve, 0))

app.onClickFunction()

app.onClickName()



