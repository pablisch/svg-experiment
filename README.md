# SVG to React component

## Purpose

This experiment is part of exploring the use of SVG files in React following the problems of using the huge TfL London Underground map SVG file, first in the original LUPO and then in an update using Vite React. Most conversion tools and standard methods of using SVG files do not seem to work. I was aware than this was a big problem in the original LUPO project and am not sure how Sam resolved it.

Current issues using the tubemap that we used in LUPO may also be because of how the SVG file was treated for use in that CRA React application.

## Dependencies in this experiment

Installed `svgr` and `rimraf` as dev dependencies following [this tutorial](https://www.youtube.com/watch?v=v0ZLEy1SE-A).

The tutorial installed `rimraf` but as far as I am aware it does not get used. Since the tuorial went beyond the scope of what I was doing it may be used later on to create a component library. `rimraf` is a cross-platform tool that acts like the Unix `rm -rf` command. It is used to delete files and directories.

## Tutorial commands did not work for me

The tutorial set up a script in `package.json` to run the command, but I didn't do that. The tutorial also used `rimraf`, possibly to delete the `comp` directory before running the command, but I didn't do that either.

The tutorial script was:
  
```json
"scripts": {
  "svgr": "svgr -d raw comp"
}
```

I tried the tutorial command but it did not work for me. Perhaps the code has changed since the tutorial was made. 

## My first successful test

First test was to convert the SVG file `down.svg` to a React component using the command shown in the [SVGR docs](https://react-svgr.com/docs/cli/). The command used was:

```bash
npx @svgr/cli -- raw/down.svg > comp/down.js  
```

This took the `down.svg` file from the `raw` directory and created a new file `down.js` in the `comp` directory. The `down.js` file is a React component that can be used in a React application. I put it into a test app to prove that it worked.

## Converting a large tube map SVG file

I tried the same thing with a newly downloaded tube map SVG file. 

```bash
npx @svgr/cli -- raw/tubemap2.svg > comp/tubemap2.js
```

This works in a Vite React app once the file extension is changed from `.js` to `.jsx`. I have no proof that it will do what I want in terms of the LUPO app, but it is a start.

## Converting the actual LUPO SVG file

I tried the same thing with the actual LUPO SVG file.

```bash
npx @svgr/cli -- raw/tube.svg > comp/tube.js 
```

The actual file was called `Tube.svg` so presumably this is case insensitive. The file was converted to a React component and put into a Vite React app. It worked.

I put the `tube.js` file into the LUPO app and it worked. It zooms and pans as expected but none fo the stations work. It turns out that none of the `ids` are retained in the conversion process. 

## Retaining the `id` attributes

Chat GPT and co-pilot gave me lots of nonsense around this and the SVGR docs did not provide any way that I found. I went through a variety of config options but none worked and most appeared to be using outdated options.

The one method that did work was to prefix the `id` attribute with a `config` file which also prefixes all the `classNames` I later discovered. By default it prefixes using the component name but you can set the default to anything you like. I used `5tati0n` as the prefix since that would be a unique value that would be easy to search and replace.

The config, `.svgorc.js`:
  
```javascript
module.exports = {
  plugins: [
    {
      name: 'prefixIds',
      params: {
        prefix: '5tati0n',
        delim: '_',
      },
    },
    // other plugins you want to enable
  ],
};
```

And then use the usual command:
```bash
npx @svgr/cli -- <source-path>/<filename>.svg > <destination-path>/<filename>.js
```
e.g.
```bash
npx @svgr/cli -- raw/tube.svg > comp/tube.js
```

Then search and replace all `5tati0n_` with `''` in the `tube.js` file. This will restore the `id` attributes to their original values. 
**NOTE** the `_` added to whatever is used as the prefix value which is the specified delimiter.

The above worked in tests and when used on the original LUPO SVG file, could be thrown straight into the LUPO app and worked as a direct replacement for the `Tube.svg` file been currently used.

It is not clear yet whether there is any advantage in using a converted file over maintaining the SVG integrity. I suspect that losing the ability to open the file in an svg editor is a disadvantage.


