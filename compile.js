// TOKENISATION USING LEXER 

function lexer(input)
{
    const tokens = [];
    // this reads the code line by line
    let cursor = 0;  

    // traversing the code
    while (cursor < input.length)
    {
        let char = input[cursor];

        // whitespace skip
        if(/\s/.test(char))
        {
            cursor++;
            continue;
        }

        // if any alphabet occurs 
        if(/[a-zA-Z]/.test(char))
        {
            let word = '';
            // forming a word using the char
            while(/[a-zA-Z0-9]/.test(char))
            {
                word += char;
                char = input[++cursor];
            }

            // introducing the rules of the language
            if(word === 'ye' || word === 'bol')
            {
                tokens.push({type: 'keyword', value: word});
            }
            else
            {
                tokens.push({type: 'identifier', value: word});
            }

            continue;
        }

        // if input is number
        if(/[0-9]/.test(char))
        {
            let num = '';
            while(/[0-9]/.test(char))
            {
                num += char;
                char = input[++cursor];
            }

            tokens.push({type: 'number', value: parseInt(num) });
            continue;
        }

        // if input is an operator
        if(/[\+\-\*\/\=]/.test(char))
        {
            tokens.push({type: 'operator', value: char });
            cursor++;
            continue;
        }

    }

    return tokens
}

// ABSTRACT SYNTAX TREE 
function parser(tokens)
{
    // declaring a tree
    const ast = {
        type: 'Program',
        body: []
    };

    // traversing the tokens
    while(tokens.length > 0)
    {
        // taking the first token
        let token = tokens.shift();

        if(token.type === 'keyword' && token.value === 'ye')
        {
            let declaration = {
                type: 'Declaration',
                name: tokens.shift().value,
                value: null
            };

            // if it is assignment operator
            if(tokens[0].type === 'operator' && tokens[0].value === '='){
                tokens.shift(); 

                let expression = '';
                while(tokens.length > 0 && tokens[0].type !== 'keyword'){
                    expression += tokens.shift().value;
                }

                declaration.value = expression.trim();

            } 

            ast.body.push(declaration);
        }

        if(token.type === 'keyword' && token.value === 'bol'){
            ast.body.push({
                type: 'Print',
                expression: tokens.shift().value
            });
        }

    }
    return ast
}

// GENERATING CODE FOR MACHINE
function codeGen(node){
    switch (node.type){
        case 'Program': return node.body.map(codeGen).join('\n');
        case 'Declaration': return `const ${node.name} = ${node.value};`
        case 'Print': return  `console.log(${node.expression})`
    }
}

function compiler(input)
{
    const tokens = lexer(input);
    const ast = parser(tokens);
    const executableCode = codeGen(ast);
    
    return executableCode;
}

function runner(input)
{
    eval(input);
}

const code = `
ye x = 10
ye y = 20

ye sum = x + y
bol sum
`

const exec = compiler(code)
runner(exec)