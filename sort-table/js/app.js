'use strict';

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

class ProductRow extends React.Component {
  render() {
    var nostock = 
      this.props.product.stocked ? '' : ' product-table__name--nostock';
    
    return (
      <tr>
        <td className={'product-table__name' + nostock}>
          {this.props.product.name}
        </td>
        <td className='product-table__price'>
          {this.props.product.price}
        </td>
      </tr>
    );
  }
}

class ProductCategoryRow extends React.Component {
  render() {
    return (
      <tr>
        <td  className='product-table__category' colSpan='2'>
          {this.props.category}
        </td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    var products = this.props.products;
    products.sort((a, b) => a.category < b.category);
    var lastCategory = null;
    var rows = [];

    products.forEach((item) => {
      if ((this.props.stocked && !item.stocked) ||
          (item.name.toLowerCase().indexOf(this.props.filter) === -1))
        return;

      if (item.category != lastCategory) {
        lastCategory = item.category;
        rows.push(
          <ProductCategoryRow 
            key={item.category} 
            category={item.category} />
        );
      }
      rows.push(<ProductRow key={item.name} product={item} />); 
    });

    var nothingFinded = (
      <tr>
        <td colSpan='2'>Ничего не найдено</td>
      </tr>
    );

    return (
      <table className='product-table'>
        <tbody>
        <tr>
          <th className='product-table__header'>Name</th>
          <th className='product-table__header'>Price</th>
        </tr>
        {rows.length ? rows : nothingFinded}
        </tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.props.callback(
      this.refs.filterInput.value,
      this.refs.stockInput.checked
    );
  }

  render() {
    return (
      <div className='search-block'>
        <input 
          type='text'
          placeholder='Search...'
          ref='filterInput'
          value={this.props.filter}
          onChange={this.onChange}
        />
        <label>
          <input
            type='checkbox'
            ref='stockInput'
            checked={this.props.stocked}
            onChange={this.onChange}
          />
          {' '}
          Only show products in stock
        </label>
      </div>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.state = {filter: '', stocked: false};
  }

  onFilterChange(filter, stocked) {
    this.setState({
      filter: filter.toLowerCase(),
      stocked: stocked
    });
  }

  render() {
    // var filter = this.state.filter;
    // var filteredProducts = this.props.products;
    
    // if (this.state.stocked) {
    //   filteredProducts = filteredProducts.filter(
    //     (item) => item.stocked
    //   );
    // }
    // if (filter) {
    //   filteredProducts = filteredProducts.filter(
    //     (item) => item.name.toLowerCase().indexOf(filter) !== -1
    //   );
    // }

    return (
      <div className='filter-products-block'>
        <SearchBar
          filter={this.state.filter}
          stocked={this.state.stocked} 
          callback={this.onFilterChange}
        />
        <ProductTable 
          products={this.props.products}
          filter={this.state.filter}
          stocked={this.state.stocked}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS}/>,
  document.getElementById('root')
);











