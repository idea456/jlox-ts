procedure isPrime(n):
    set check to true
    for i in 1 to n:
        if n % i == 0 then:
            set check to false
    return check


procedure isPrime(n)
    set check to true // let
    for i in 1 to n
        if n % i == 0 then
            return false
        end if
    end for
    return true
end prodedure

procedure isPrime(n):
    check := true
    for i := 1 to n:
        if n % i == 0 then
            return false
    return true

procedure isPrime(n):
    assume check is true // const
    for i in 1 to n:
        if n % i == 0 then
            return false
    return true
