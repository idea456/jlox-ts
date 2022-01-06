procedure isPrime(n):
    set check to true
    for i in 1 to n:
        if n % i == 0 then:
            set check to false
    return check



procedure isPrime(n):
    assume PI to 3.14 // const
    set check to true // let
    for i in 1 to n:
        if n % i == 0 then:
            say "This number is a prime!"
            set check to false
            return false
        else:
            say "Still checking"
    return true

class Number:
    private n;
    private m;

    initialize(n, m):
        set this.n to n
        set this.m to m
    


procedure checkPrime(n):
    assume PI to 3.14 // const
    set check to true // let
    set n to 1 
    while check is not true:
        set n to n + 1
        set n to isPrime(n)
        if isPrime(n) then:
            say "This number is not a prime!"
            set check to false
    return check

procedure getNodes():
    set nodes to {}
    while nodes.length === 0:
        if nodes[i] === null then: 
            set nodes[i] to 0
        else if (nodes[i] is number) {
            set nodes[i] to "0"
        }
        else:
            set nodes[i] to nodes[i] + 1
        set node to Node()
        set node.i to 0
        set node.value to null
        push node to nodes
        

define getNodes():
    set nodes to {}
    assume PI to 3.14
    while nodes.length === 0 then
        if nodes[i] === null then
            set nodes[i] to 0
        elsif (nodes[i] is number) then
            set nodes[i] to "0"
        }
        else:
            set nodes[i] to nodes[i] + 1
        set node to Node()
        set node.i to 0
        set node.value to null
        push node to nodes
        return nodes.length === 0 then true else false