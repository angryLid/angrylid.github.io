---
title: A React Pitfall by Previous Developers
slug: 5-react-pitfall
created-time: 2025-12-16
---
# A React Pitfall by Previous Developers

An incident was reported yesterday.

After analyzing the cause, I discovered that all the `Page` components inherited from a `BasePage` component that had already implemented the `componentDidMount` method. 

A recent update involved implementing the `componentDidMount` method for `PageA`. 

Naturally, `super.componentDidMount()` was not called.

After all, who would have thought the previous programmer would leave such a pitfall?

```javascript
class BasePage extends React.Component {
    componentDidMount() {
        this.initializeEssentialServices(); 
    }
    /* ... */
}

class PageA extends BasePage {

    /* 
    This method was implemented in a recent update
    without calling super.componentDidMount()
    */
    componentDidMount() {
        this.loadSpecificData(); 
    }
    /* ... */
}
```