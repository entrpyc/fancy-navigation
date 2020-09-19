# `name-of-package`

Vanilla, lightweight navigation.

<!-- [![rc-horizontal-scroll](https://nodei.co/npm/rc-horizontal-scroll.png)](https://npmjs.org/package/rc-horizontal-scroll) -->

<!-- ## Example

http://react-component.github.io/table/examples/ -->

## `Features`

- Draggable on desktop
- Horizontal navigation
- Scroll to section
- Change active item on scroll

## `Usage`

Sample html

```html
<nav class="navigation-container">
  <div class="navigation-buttons">
    <button class="name-of-package-left">&lt;</button>
    <button class="name-of-package-right">&gt;</button>
  </div>
  <ul class="name-of-package">
    <!-- Note the section selector -->
    <li class="name-of-package-anchor" data-section="#section1">anchor 1</li>
    <li class="name-of-package-anchor" data-section="#section2">anchor 2</li>
    <li class="name-of-package-anchor" data-section="#section3">anchor 3</li>
    <li class="name-of-package-anchor">
      <a href="https://google.com">Anchor without section</a>
    </li>
  </ul>
</nav>
```

Using NPM

```js
import "name-of-package";

const nav = new NameOfClass({
  // ...props,
  // ...hooks,
});

// mount navigation
nav.mount();
```

Using CDN

```html
<script src="cdn-path" defer></script>

<script defer>
  var nav = new NameOfClass({
    // ...props,
    // ...hooks,
  });

  // mount navigation
  nav.mount();
</script>
```

## `API`

### `Properties`

| Name                    | Type         | Default                                                    | Description                                                              |
| ----------------------- | ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| selector                | string       | .name-of-package                                           | Navigation element selector                                              |
| anchorSelector          | string       | .name-of-package-anchor                                    | Anchor elements selector                                                 |
| selectedAnchorClass     | string       | name-of-package-selected                                   | Selected anchor class                                                    |
| anchorAnimationEasing   | css easing   | ease                                                       | Anchor change - css animation easing                                     |
| anchorAnimationDuration | css duration | 0.3s                                                       | Anchor change - css animation duration                                   |
| dragActiveClass         | string       | name-of-package-active                                     | Active class while the navigation is being dragged                       |
| dragSpeed               | number       | 1                                                          | Move speed (only for desktop)                                            |
| leftArrowSelector       | string       | .name-of-package-left                                      | Left arrow selector                                                      |
| rightArrowSelector      | string       | .name-of-package-right                                     | Right arrow selector                                                     |
| scrollToSection         | function     | section => section.scrollIntoView({ behavior: 'smooth' }); | Handles the scroll animation, our solution doesn't work in IE and Safari |

### `Hooks`

| Name             | Executed when              | Args                                                    |
| ---------------- | -------------------------- | ------------------------------------------------------- |
| onAnchorChange   | The selected anchor change | first: the anchor element, second: navigation instance  |
| onMount          | Navigation gets mounted    | first: the navigation instance                          |
| onSectionReached | A section is reached       | first: the section element, second: navigation instance |

### `Functions`

| Name          | Functionality          | Args                                                                                                                                                          |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mount         | Add all events         | -                                                                                                                                                             |
| unmount       | Remove all events      | -                                                                                                                                                             |
| changeAnchor | Change selected anchor | anchor: element, withAnimation: boolean - change anchor with animation(default: true), scrollToSection: boolean - should scroll to section (default: false) |

## `License`

name-of-package is released under the MIT license.
