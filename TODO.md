# TODO

1. ~~Express router and basic server app~~

2. ~~Browser build (should support aliases and include content of node_modules)~~

3. ~~Support for params in queries. It support :named and *splat params~~

4. Server side view rendering (don't know jade or other templates)

5. State transmission to client with first request

6. State intialization: server from db, client from first request

7. Add support for dependencies in bundler (should wrap window object)

## Test of client bundlers

### browserbuild

+ Very tiny wrapper

+ Support debugging

- Do not take npm dependencies !!!

### one

- not worked for me at all even with own manifest

### browserify

+ It works and bundle almost all things

- Need find way to force include some dependencies

- Strange wrapper

- Do not filter deps

### stitch

- Do not take npm dependencies !!!


## What i need to browser bundler

1. It should be able to find node dependencies

2. DONE.~~It should not be restrected to begin work on one file.~~

3. Should allow create aliases.

Ok, working bundler from browserbuild but was need to patch backbone (maybe need to add support for set dependencies via exports?)