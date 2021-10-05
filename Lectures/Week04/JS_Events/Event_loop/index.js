function textInject(tag, str) {
    const elem = document.createElement(tag);
    elem.textContent = str;
    document.body.append(elem);
}

function baz() {
    console.log("bye!!!");
    textInject("h3", "baz");
}

function bar() {
    textInject("h2", "bar");
}

function foo() {
    textInject("h1", "foo");
    setTimeout(baz, 1000);
    console.log("hello");
    setTimeout(bar, 2500);
}

foo();