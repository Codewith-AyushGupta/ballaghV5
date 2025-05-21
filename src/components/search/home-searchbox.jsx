import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ALink from "../utils/alink";
import { useApiData } from "../../service/api-data-provider";
import StoreDatabaseService from "../../service/store-database-service";
import { Navigate, useNavigate } from "react-router-dom";
function HomeSearch(props) {
  const {
    storeDatabase,
    storeDatabaseLoading,
    storeDatabaseIsError,
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,
  } = useApiData();
  const navigate = useNavigate();
  const { SearchBarForMobile = false } = props;
  const [search, setSearch] = useState("");
  let storeDatabaseInstance;
  const [searchResult, setSearchResult] = useState([]);
  const onSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.parentNode.classList.toggle("show");
  };

  const onBodyClick = (e) => {
    if (e.target.closest(".header-search")) {
      const headerSearch = e.target.closest(".header-search");
      if (!headerSearch.classList.contains("show-results")) {
        headerSearch.classList.add("show-results");
      }
      return;
    }
    const showElement = document.querySelector(".header-search.show");
    if (showElement) showElement.classList.remove("show");
    const resultsElement = document.querySelector(
      ".header-search.show-results"
    );
    if (resultsElement) resultsElement.classList.remove("show-results");
  };

  useEffect(() => {
    document.body.addEventListener("click", onBodyClick);
    if (!storeDatabaseLoading) {
      storeDatabaseInstance = new StoreDatabaseService(storeDatabase);
    }
    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, [storeDatabaseLoading]);

  const matchEmphasize = (name, query) => {
    const parts = name.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={i}>{part}</strong>
      ) : (
        part
      )
    );
  };

  const onSearchChange = (event) => {
    const query = event.target.value;
    if (!storeDatabaseInstance) {
      storeDatabaseInstance = new StoreDatabaseService(storeDatabase);
    }
    setSearch(query);
    if (query.length > 2) {
      const filteredResults =
        storeDatabaseInstance.searchStoreBySearchKey(query);
      setSearchResult(filteredResults || []);
    } else {
      setSearchResult([]);
    }
  };
  const seeSearchResult = (event) => {
    event.preventDefault();
    navigate(`/search-result?key=${search}`)
    setSearch('')
  };
  if (tenantConfigurationLoading || storeDatabaseLoading) {
    return "";
  }

  if (tenantConfigurationIsError || storeDatabaseIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div
      className={`header-search hs-simple ${SearchBarForMobile ? "mr-0" : ""}`}
    >
      <a
        href="#"
        className="search-toggle"
        role="button"
        onClick={onSearchClick}
      >
        <i className="icon-search-3"></i>
      </a>
      <form
        action="#"
        method="get"
        onSubmit={seeSearchResult}
        className="input-wrapper"
      >
        <input
          type="text"
          className="form-control"
          name="search"
          autoComplete="off"
          value={search}
          onChange={onSearchChange}
          placeholder="Search Store..."
          required
        />
        <button className="btn btn-search" type="submit">
          <i className="d-icon-search"></i>
        </button>

        <div
          className={`live-search-list bg-white scrollable ${
            searchResult.length > 0 ? "show" : ""
          }`}
        >
          {search.length > 2 ? (
            <ALink
              href={`/search-result?key=${search}`}
              className="autocomplete-suggestion"
              key={`search-result`}
            >
              
              <div className="search-name">Hit Enter To See Search Result.</div>
            </ALink>
          ) : (
            search.length >= 1 && (
              <>
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    className="autocomplete-suggestion"
                    key={`loading-placeholder-${index}`}
                  >
                    <LazyLoadImage
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjQTyBhMZCPlcC5iqPn_Os3ZeUQ0S3171eGA&s"
                      width={40}
                      height={40}
                      alt="placeholder"
                    />
                    <div className="search-name loading"></div>
                    <span className="search-price">
                      <span
                        className="new-price mr-1"
                        style={{
                          display: "flex",
                          height: "18px",
                          width: "30vw",
                          backgroundColor: "#d8d9dd",
                          marginBottom: "1%",
                        }}
                      ></span>
                      <span
                        className="old-price"
                        style={{
                          display: "flex",
                          height: "18px",
                          width: "15vw",
                          backgroundColor: "#d8d9dd",
                          marginBottom: "1%",
                        }}
                      ></span>
                    </span>
                  </div>
                ))}
              </>
            )
          )}
        </div>
      </form>
    </div>
  );
}

export default React.memo(HomeSearch);
