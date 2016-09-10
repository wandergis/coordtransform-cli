# coordtransform-cli
A  CLI version for coordtransform module.

### CLI Usage

`npm install -g coordtransform-cli`

```
Usage: coordtransform -t typename input output

Options:
  -t, --type  transform type.
     [string] [required] [choices: "bd09togcj02", "gcj02tobd09", "wgs84togcj02", "gcj02towgs84"]
  -h, --help  Show help                                [boolean]

Examples:
  coordtransform -t bd09togcj02  input.geojson output.geojson
```

### Node or browser Usage
`npm install coordtransform-cli`

```
var transformGeoJSON = require('coordtransform-cli');
var anygeojson = { type: 'Point', coordinates: [118, 34] };
var result = transformGeoJSON(anygeojson, 'wgs84togcj02');
console.log(result);
```