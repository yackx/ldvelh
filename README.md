# LDVELH

Pour jouer en ligne, [c'est ici](https://play.sugoi.be/ldvelh/) － To play online, [click here](https://play.sugoi.be/ldvelh/) \[fr\]

___

## At a Glance

`ldvelh` is an attempt to revive an [adventure gamebook](https://en.wikipedia.org/wiki/Gamebook#Adventure_gamebooks) in HTML form. It stands for «Livre Dont Vous Êtes Le Héros», the French translation of the genre.

It is focused on the [Sorcery!](https://en.wikipedia.org/wiki/Sorcery!) series by Steve Jackson. Currently, the first book «The Shamutanti Hills» has been implemented. French version only at this stage: «Les Collines Maléfiques».

Unlike other franchises, this projects aims at keeping things as close as possible to the original paper form: text and original illustrations only. No added visual effects or modern gimmicks were added. Think of it as a glorified paper version: no need to keep your adventure sheet up to date, or to manage your backpack items, or to roll the dices. The applications takes care of it for you. Turning to a chapter is now achieved by clicking on a link.

## Project

### Layout

Divided in two modules:

* angular: the bulk of the application
* chapter-chopper: utility to convert a specific version of the book into individual chapters

The main application is an `AngularJS` application with `bootstrap` and `underscore.js`. It is reasonably straightforward, although more modularity can certainly be achieved.

There is no server: everything runs in the user browser, using local storage to store progress.

### Toolchain

* Gradle 2.13
* karma
* Local HTTP server

Note that the tools usually found around web/angular development (bower, gulp, grunt, npm, ...) are not part of the required toolchain, although they can be used locally. For running the tests with `karma`, you will most likely have to use `npm`.

All libraries are stored and committed to avoid build and dependencies hell. Any local webserver to serve the content will do.

### Build

To build the project, simply run `gradle`:

    angular$ gradle

The resulting output will be generated in `angular/publish`. Let your local webserver point to the `publish` directory (or copy it to your webserver public folder). If you have `python` installed, a hassle-free solution is to run the following command:

    angular/publish$ python -m SimpleHTTPServer 8080

then open a browser pointing at [localhost:8080](http://localhost:8080).

### Run the tests

Tests can be found under `angular/test/unit`, for `ng` controllers and services.

    angular$ scripts/test.sh

However, given the fact that the application was written a couple of years ago and that the tools have evolved, running the tests may be challenging (a.k.a. I couldn't run them anymore when I decided to release the code).

## Contribute

You are more then welcome to contribute! Things you can do:

* Implement missing sequences (eg a potion that should increase your stamina)
* Add missing features (eg screen when your character runs out of stamina)
* Improve the look&feel
* Adapt the code base so that the tests can be run with karma
* Migrate the toolchain to a more conventional stack (bower, gulp, grunt, npm, ...)
* Add the next book! (although we'd better tighten the code base first!)

### How to

Improvements can be delivered as pull requests:

* Reasonably commented
* Consistent with the existing coding style
* In English (even though the book is currently in French)
* Keep things clean. Files and modules are already heavyweight, so do not hesitate to split them

Admittedly, the code base may not always be in phase with these guidelines.

For non-trivial changes, it is a good idea to first create a new issue and discuss how to tackle it prior to the actual implementation.

## License

See [license file](LICENSE.md).
