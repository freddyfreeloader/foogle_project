
/**
 * Returns all interactive Elements in provided root.
 * 
 * **Note:**
 * 
 * Interactive element could have state 'disabled', so it is interactive but not focusable by default!
 * 
 * @param {Node} root start point to query, defaults to document
 * @returns all elements that is interactiv
 */
export async function findInteractiveElements(root = document) {
  const predicate = (node) => node.tabIndex >= 0;
  return await findElements(root, predicate);
}

/**
 * Works like querySelectorAll().
 *
 * Query the lightDOM and all deep nested shadowDOMs, each found shadowHost await updateComplete before search.
 *
 * @param {String} selectors standard CSS selectors
 * @param {Node} root start of search, defaults to document
 * @returns {Promise<Node[]>} Promise with nodes
 *
 * **Note**
 *
 * Cannot match selectors across webComponents shadowRoots!
 *
 *     queryDeep('.parentClass .classOfSameWebComponentAsParentClass') // works
 *     queryDeep('.parentClass .classInsideOfNestedWebComponent') // doesn't work
 */
export async function queryDeepAll(selectors, root = document) {
  return await findElements(root, (node) => node.matches(selectors));
}

/**
 * Works like querySelectorAll()[lastIndex]
 *
 * Query the lightDOM and all deep nested shadowDOMs, each found shadowHost await updateComplete before search.
 *
 * @param {String} selectors standard CSS selectors
 * @param {Node} root start of search, defaults to document
 * @returns {Promise<Node>} Promise with node
 *
 * **Note**
 *
 * Cannot match selectors across webComponents shadowRoots!
 *
 *     queryDeep('.parentClass .classOfSameWebComponentAsParentClass') // works
 *     queryDeep('.parentClass .classInsideOfNestedWebComponent') // doesn't work
 */
export async function queryDeepLast(selectors, root = document) {
  return (await findElements(root, (node) => node.matches(selectors))).pop();
}

/**
 * Works like querySelector()
 * 
 * Query the lightDOM and all deep nested shadowDOMs, each found shadowHost await updateComplete before search.
 *
 * @param {String} selectors standard CSS selectors
 * @param {Node} root start of search, defaults to document
 * @returns {Promise<Node>} Promise with first node that matches selectors
 *
 * **Note**
 *
 * Cannot match selectors across webComponents shadowRoots!
 *
 *     queryDeep('.parentClass .classOfSameWebComponentAsParentClass') // works
 *     queryDeep('.parentClass .classInsideOfNestedWebComponent') // doesn't work
 */
export async function queryDeep(selectors, root = document) {
  return await findFirstElement(root, (node) => node.matches(selectors));
}

/**
 * Returns the last node that matches ':focus'.
 *
 * @returns Promise<Node{}>  the last node matches ':focus'
 */
export async function getFocusedElement() {
  return await queryDeepLast(':focus');
}

/**
 * Returns all shadow hosts.
 * 
 * @param {Node} root start to search, defaults to document
 * @returns Promise<Node[]> of all shadow hosts
 */
export async function findAllWebComponents(root = document) {
  return await findElements(root, (node) => node.renderRoot || node.shadowRoot);
}
/**
 * Collects all nodes of the lightDOM and all deep nested shadowDOMs that meets the conditions of the predicate.
 * Each found shadowHost await updateComplete before search.
 * 
 * Example:
 * 
 *     const allButtons = await findElements(document, (node) => node.tagName.toLowerCase() === 'button')
 * 
 * @param {Node} root start node for searching
 * @param {Callback} predicate to test each node
 * @returns Promise<Node[]>
 */
export async function findElements(root, predicate) {
  let node;
  const elements = [];

  async function diveNode(diveRoot) {
    let iterator = document.createNodeIterator(
      diveRoot,
      NodeFilter.SHOW_ELEMENT,
      (node) =>
        node.shadowRoot || predicate(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
    );
    while ((node = iterator.nextNode())) {
      if (predicate(node)) {
        elements.push(node);
      }
      if (node.shadowRoot) {
        await node.updateComplete;
        for (const child of [...node.shadowRoot.children]) {
          await diveNode(child);
        }
      }
    }
  }

  if (root.shadowRoot) {
    await root.updateComplete;
  }

  await diveNode(root);
  return elements;
}
/**
 * Returns the first node of the lightDOM and of all deep nested shadowDOMs that meets the conditions of the predicate.
 * Each found shadowHost await updateComplete before search.
 * 
 * Example:
 * 
 *     const firstButton = await findFirstElement(document, (node) => node.tagName.toLowerCase() === 'button')
 * 
 * @param {Node} root start node to search from
 * @param {Callback} predicate to test each node
 * @returns Promise<Node{}>
 */
export async function findFirstElement(root, predicate) {
  let node;

  async function diveNode(diveRoot) {
    let iterator = document.createNodeIterator(
      diveRoot,
      NodeFilter.SHOW_ELEMENT,
      (node) =>
        node.shadowRoot || predicate(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
    );
    while ((node = iterator.nextNode())) {
      if (predicate(node)) {
        return node;
      }
      if (node.shadowRoot) {
        await node.updateComplete;
        for (const child of [...node.shadowRoot.children]) {
          const res = await diveNode(child);
          if (res) {
            return res;
          }
        }
      }
    }
  }

  if (root.shadowRoot) {
    await root.updateComplete;
  }
  return await diveNode(root);
}
