package googlesearch

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/chromedp/chromedp"
)

type SearchResults struct {
	Title   string
	Link    string
	Snippet string
	KeyWord string
}

func Search(keyword string) ([]SearchResults, error) {
	url := fmt.Sprintf("https://www.google.com/search?q=%s", keyword)
	userAgentList := [3]string{
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
	}

	// Randomly select a user agent
	randomUserAgent := userAgentList[rand.Intn(len(userAgentList))]

	// Create a new context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// Set up the headless browser with chromedp
	options := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-software-rasterizer", true),
		chromedp.UserAgent(randomUserAgent),
	)
	allocatorContext, cancel := chromedp.NewExecAllocator(ctx, options...)
	defer cancel()

	ctx, cancel = chromedp.NewContext(allocatorContext)
	defer cancel()

	// Set a timeout for loading the page
	ctx, cancel = context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	// Navigate to the URL
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.WaitReady("body", chromedp.ByQuery),
	)
	if err != nil {
		log.Fatal(err)
	}

	// Get the HTML content after JavaScript execution
	var htmlContent string
	err = chromedp.Run(ctx,
		chromedp.OuterHTML("html", &htmlContent),
	)
	if err != nil {
		log.Fatal(err)
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlContent))
	if err != nil {
		log.Fatal(err)
	}

	var searchResults []SearchResults

	doc.Find("div.g").Each(func(i int, result *goquery.Selection) {
		title := result.Find("h3").First().Text()
		link, _ := result.Find("a").First().Attr("href")
		snippet := result.Find(".VwiC3b").First().Text()

		searchResult := SearchResults{
			Title:   title,
			Link:    link,
			Snippet: snippet,
			KeyWord: keyword,
		}

		searchResults = append(searchResults, searchResult)

	})

	return searchResults, nil
}
