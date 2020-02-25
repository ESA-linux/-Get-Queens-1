root@db8fc13972fc:/myapp# pip list | grep validators
validators         0.12.1     
root@db8fc13972fc:/myapp# python
Python 2.7.15 (default, May  5 2018, 03:27:20) 
[GCC 6.3.0 20170516] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import validators
>>> crazy_string='p.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.'
>>> validators.domain(crazy_string)
ValidationFailure(func=domain, args={'value': 'p.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.wo.'})