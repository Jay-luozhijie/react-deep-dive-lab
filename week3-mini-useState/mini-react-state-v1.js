let state;

function useState(initialValue) {
    state = state || initialValue
    const setState = newValue => {
        console.log('setState called with', newValue)
        state = typeof newValue === 'function' ? newValue(state) : newValue
        render()
    }
    return [state, setState]

}

function App() {
    const [count, setCount] = useState(0)

    console.log('App render', count)
    return {
        onClickFunction() {
            setCount(prev => prev + 1)
        },
        onClickValue(){
            setCount(count + 1)
        }
    }
}

let app;

function render() {
    console.log('Render App Start')
    app = App()
    console.log('Render App End')
}

render()

app.onClickValue()
app.onClickValue()  

// app.onClickFunction()
// app.onClickFunction()
// app.onClickFunction()


