export function createElement(type, props, ...children) {
    return { 
        type, 
        props: { ...props } ?? {},
        children: children.flat()
    }
}

export function scheduleRender(){
    if (!isRendering) {
        isRendering = true
        Promise.resolve().then(() =>{
            queue.forEach(fn => fn())
            queue = []
            render()
            isRendering = false
        })
    }
}

export function renderToDom(vdom, index = 0) {
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }

    if (vdom.type instanceof Function) {
        let id = vdom.props?.key
                ? `${vdom.type.name}-${vdom.props.key}`
                : `${vdom.type.name}-${renderPath.append(index).join('.')}`
        console.log('Rendering component', vdom.type.name, 'with id', id)
        
        if (!componentHooksMap.has(id)) {
        componentHooksMap.set(id, [])
        }
        currentComponent = id
        currentHook = 0
        renderPath.push(index)
        const childVdom = vdom.type(...vdom.props)
        renderPath.pop()
        return renderToDom(childVdom)
    }

    const dom = document.createElement(vdom.type)

    vdom.props && Object.entries(vdom.props).forEach(([key, value]) => {
        if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase()
        dom.addEventListener(eventType, value)
        } else {
        dom.setAttribute(key, value)
        }
    })

    vdom.children.forEach((child, i) => dom.appendChild(renderToDom(child, i)))

    return dom
}