# cappuccino

Yep, another js preprocessor.

```
  a = 3; # Works like earlier
  a <= 3; # Copies value
  a @= 3; # Copies reference

  *a = (b, c) -> b + c; # Computed value a
  ->
  var b = new Observable();
  var a = new Observable({
    depends: ['b', 'c'],
    compute: function (b, c) {
      return b + c;
    }
  });

  b = 3;



```

### TODO

* Some rules might have the same priority
