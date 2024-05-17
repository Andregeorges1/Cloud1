import React from 'react';
import axios from 'axios';
import './ArticleApp.css';

class ArticleApp extends React.Component {
  state = {
    formData: {
      title: '',
      author: '',
      abstract: '',
      journal: ''
    },
    articles: []
  };

  componentDidMount() {
    this.fetchArticles();
  }

  fetchArticles = async () => {
    try {
      const response = await axios.get('http://13.49.251.195:3001/articles');
      this.setState({ articles: response.data });
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://13.49.251.195:3001/articles', this.state.formData);
      alert('Article added successfully');
      this.setState({
        formData: {
          title: '',
          author: '',
          abstract: '',
          journal: ''
        }
      });
      this.fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Error adding article');
    }
  };

  handleUpdate = async (id) => {
    const newAbstract = prompt('Enter new abstract:');
    if (newAbstract !== null) {
      try {
        await axios.put(`http://13.49.251.195:3001/articles/${id}`, { abstract: newAbstract });
        this.fetchArticles();
      } catch (error) {
        console.error('Error updating article:', error);
      }
    }
  };

  handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://13.49.251.195:3001/articles/${id}`);
        this.fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  render() {
    return (
      <div className="article-container">
        <div className="floating-container">
          <h2>Add Article</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" name="title" value={this.state.formData.title} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <input type="text" name="author" value={this.state.formData.author} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label>Abstract:</label>
              <textarea name="abstract" value={this.state.formData.abstract} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label>Journal:</label>
              <input type="text" name="journal" value={this.state.formData.journal} onChange={this.handleChange} />
            </div>
            <button type="submit">Add Article</button>
          </form>
        </div>

        <div className="floating-container">
          <div className="article-list">
            <h2>Article List</h2>
            <ul>
              {this.state.articles.map((article) => (
                <li key={article.id}>
                  <strong>Title:</strong> {article.title} | <strong>Author:</strong> {article.author} |{' '}
                  <strong>Abstract:</strong> {article.abstract} | <strong>Journal:</strong> {article.journal}{' '}
                  <button className="btn-update" onClick={() => this.handleUpdate(article.id)}>Update</button>{' '}
                  <button className="btn-delete" onClick={() => this.handleDelete(article.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ArticleApp;
