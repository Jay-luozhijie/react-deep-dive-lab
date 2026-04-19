export function App() {
    const [count, setCount] = useState(0)
    const [name, setName] = useState('Tom')

    return createElement('div', null, 
            createElement('h1', null, `Count: ${count}`),
            createElement('button', { onClick: () => setCount(count + 1) }, 'Increment Count'),
            createElement('h2', null, `Name: ${name}`),
            createElement('button', { onClick: () => setName(name === 'Tom' ? 'Jerry' : 'Tom') }, 'Toggle Name'),
            createElement(Counter, { key: 'counter1' }),
            createElement(Counter, { key: 'counter2' }),
            createElement(Counter, { key: 'counter3' })
        )
}

export function Counter() {
    const [count, setCount] = useState(0)

    return createElement('div', null, 
            createElement('h1', null, `Count: ${count}`),
            createElement('button', { onClick: () => setCount(count + 1) }, 'Increment Count')
    )
}