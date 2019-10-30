import React from 'react'
import Loader from '../Spinner.gif'
import axios from 'axios'
import PageNavigation from "./PageNavigation";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNo: 0
        };
        this.cancel = ''
    }

    handleOnInputChange = (e) => {
        const query = e.target.value;
        if (!query) {
            this.setState({query, results: {}, totalResults: 0, totalPages: 0, currentPageNo: 0, message: ''})
        } else {
            this.setState({query, loading: true, message: ''}, () => {
                this.fetchSearchResults(0, query) // important moment that we call fetchSearchResults inside
                // callback function of setState, thaw because setState is asynchronus we sure that fetchSearchResults would
                // be called after setState
            })
        }
    }

    fetchSearchResults = (updatePageNo = '', query) => {
        console.log(updatePageNo)
        const pageNumber = updatePageNo ? `&page=${updatePageNo}` : '';
        const searchUrl = `https://pixabay.com/api/?key=12413278-79b713c7e196c7a3defb5330e&q=${query}${pageNumber}`;
        if (this.cancel) {
            this.cancel.cancel();
        }
        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {
            cancelToken: this.cancel.token
        })
            .then((res) => {
                const total = res.data.total
                const totalPagesCount = this.getPagesCount(total, 20)
                const resultNotFoundMsg = !res.data.hits.length ? 'There are no more search results. Please try a new search'
                    : '';
                this.setState({
                    results: res.data.hits,
                    totalResults: total,
                    currentPageNo: updatePageNo,
                    totalPages: totalPagesCount,
                    message: resultNotFoundMsg,
                    loading: false
                })
            })
            .catch((error) => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch. Check network'
                    })
                }
            })

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.cancel=''
    }

    renderSearchResults = () => {
        const {results} = this.state
        if (Object.keys(results).length && results.length) {
            return (
                <div className="results-container">
                    {results.map((result) => {
                        return (
                            <a key={result.id} href={result.previewURL} className="result-items">
                                <h6 className="image-username">{result.user}</h6>
                                <div className="image-wrapper">
                                    <img className="image" src={result.previewURL} alt={result.user}/>
                                </div>
                            </a>
                        )
                    })}

                </div>
            )
        }
    }

    handlePageClick = ( type) => {
        console.log({currentPageNo:this.state.currentPageNo-1})
        'prev' === type ? this.setState({currentPageNo:this.state.currentPageNo-1}) :
            this.setState({currentPageNo:this.state.currentPageNo+1});
        if (!this.state.loading) {
            this.setState({
                loading: true,
                message: ''
            }, () => {
                this.fetchSearchResults(this.state.currentPageNo, this.state.query)
            })
        }


    }


    getPagesCount = (total, denominator) => {
        const dovisble = total % denominator === 0
        const valueToAdd = dovisble ? 0 : 1
        return Math.floor(total / denominator) + valueToAdd
    }


    render() {
        const {message, loading, query, currentPageNo, totalPages} = this.state
        const showPrevLink = 1 < currentPageNo
        const showNextLink = totalPages > currentPageNo
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-10 offset-sm-1 text-center">
                        <h2 className="heading">Live Search</h2>
                        <input
                            type="text"
                            value={query}
                            placeholder="Search"
                            className="form-control"
                            onChange={e => this.handleOnInputChange(e)}
                        />
                        {message && <p className="message">{message}</p>}
                        <PageNavigation
                            loading={loading}
                            showPrevLink={showPrevLink}
                            showNextLink={showNextLink}
                            handlePrevClick={() => this.handlePageClick('prev')}
                            handleNextClick={() => this.handlePageClick('next')}
                        />
                        {this.renderSearchResults()}
                        <PageNavigation
                            loading={loading}
                            showPrevLink={showPrevLink}
                            showNextLink={showNextLink}
                            handlePrevClick={() => this.handlePageClick('prev')}
                            handleNextClick={() => this.handlePageClick('next')}
                        />
                        <img src={Loader} className={`search-loading ${loading ? 'show' : 'hide'}`} alt="loader"/>
                    </div>
                </div>
            </div>

        )

    }

}

export default Search