# Entity Class Generator
Recently I needed to create 20+ classes to represent entities returned from an API endpoint. Each class having about 40 to 50 or more attributes. So rather than creating all these classes manually I wrote this little application to generate the classes for me. 

## Prequisites
- Nodejs (tested on 6.x)

## Example
An HTTP GET call to `http://localhost/api/items` returns a list of items where an item has the attributes `id`, `name` and `created_date`. So the returned list looks like
```
[
  {"id":1, "name": "Lightsaber", "created_date": "2016-05-01"},
  {"id":2, "name": "Tunic", "created_date": "2016-05-01"},
  {"id":3, "name": "Kyber Crystal", "created_date": "2016-05-01"},
]
```

In order to use the data from the API, one of the first things I do is assign them to a data structure in this case the data structure will be an array of object Items. Therefore in the front-end (I am using Angular 2 at the moment) I have typescript class as follows

```
class Items {
   id: number;
   name: string;
   createdDate: string;
}
```

The above class is easy enough to type out but when you need to create 20+ classes with each class having 40+ attributes, its time to think of a more productive approach. This application is my productive approach.

## How it works
- Make an HTTP GET request to an API endpoint that returns a list of objects. 
- Get the first element of this list
- Loop through the element attributes and create a class file based on the type of attribute. 

NOTE: This was created for personal use and to support my very specific use case. 
