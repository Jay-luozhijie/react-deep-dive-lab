export function useState(initialValue) {
    const id = currentComponent
    if (!componentHooksMap.has(id)) {
        componentHooksMap.set(id, [])
    }
    const hooks = componentHooksMap.get(id)

    const hookIndex = currentHook
    hooks[hookIndex] = hooks[hookIndex] ?? initialValue
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