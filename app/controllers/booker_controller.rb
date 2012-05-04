require 'rexml/document'
#require 'mechanize'
require 'cgi'

class BookerController < ApplicationController
#  include Mechanize

  def all

  end
  def index
    @title = params[:title]
    @chap_index = params[:chapIndex].to_i
    @book = File.read(Dir.pwd + "/public/books/book_#{@title}.xml")
    @xml_elements = (REXML::Document.new @book).root.elements

    @chap = @xml_elements["chapters"][2*@chap_index+1]
    @chap_attr = @chap.attributes
    @xml_chapter = '<?xml version="1.0" encoding="utf-8"?>' +
        '<bookData>' +
        '<chapNum>'+@chap_attr['num'] + '</chapNum>' +
        '<chapTitle>'+@chap_attr['title']+'</chapTitle>' +
        '<chapText>' + @chap.text.to_s + '</chapText>'
    @count = 0
    @xml_elements.each("chapters/chapter") { @count += 1 }
    @xml_chapter += '<totalChapters>'+@count.to_s+'</totalChapters>' +
        '</bookData>'
     render :xml => @xml_chapter
  end

  def completer
    @plants = [
        "Abiu",
    "Amazonian Grape",
    "Avocado",
    "Barbados Cherry",
    "Beach Cherry",
    "Black Sapote",
    "Breadfruit",
    "Bunchosia",
    "Canistel",
    "Carambola",
    "Cashew",
    "Chempadek",
    "Cinnamon",
    "Clove",
    "Cocoa",
    "Coffee",
    "Davidson Plum",
    "Durian",
    "Galip Nut",
    "Giant Granadilla",
    "Golden Passionfruit",
    "Grumichama",
    "Guava",
    "Herbert River Cherry",
    "Ice-cream Bean",
    "Jaboticaba",
    "Jakfruit",
    "Langsat-Duku",
    "Lemonade",
    "Lime",
    "Lychee",
    "Mabolo",
    "Macadamia",
    "Malabar Chestnut",
    "Malay Roseapple",
    "Mamey Sapote",
    "Mandarin",
    "Mangosteen",
    "Maprang",
    "Marang",
    "Keppel",
    "Langsat/Duku",
    "Lucmo",
    "Mango",
    "Matisia",
    "Miracle Fruit",
    "Mulberry",
    "Papaya",
    "Pepper",
    "Pulasan",
    "Pummelo",
    "Rambai",
    "Rambutan",
    "Rollinia",
    "Salak",
    "Santol",
    "Sapodilla",
    "Soursop",
    "Star Apple",
    "Sweetsop",
    "Tumeric",
    "Vanilla Bean",
    "Wax Jambu",
    "White Sapote",
    "Yellow Mangosteen"]
    @input = params[:input].downcase
    @input_len = @input.length

    if (@input_len > 0)

      @plants.each do |plant|
        if (plant[0..@input_len-1].downcase == @input)
#          leftover_len = plant.length - @input_len+1
          word_to_return =  plant[@input_len..plant.length-1]
          render :text => word_to_return
          return
        end
      end
    end

    render :text => ""

  end

  def zip_lookup
     zip_code = params[:zipCode]
#    header('Content-Type: text/xml');
#    Load the XML location data from the server
    url = "http://www.webservicex.net/uszip.asmx/GetInfoByZIP?USZip=" + zip_code.to_s
    agent = Mechanize.new
    xml = agent.get_file(url)


#    Return the XML location data
    render :xml => xml

  end

  def stocks_picker
    symbol = params[:symbol]
#    xml = File.read('public/stocks/' + symbol + '.xml')
    url = "http://www.webservicex.net/stockquote.asmx/GetQuote?symbol=" + symbol
    agent = Mechanize.new
    xml = CGI.unescapeHTML(agent.get_file(url))

    render :xml => xml

  end


  def news_feeder
    rss_url = params[:rssurl]
#   Return the RSS feed data
    agent = Mechanize.new
    #xml = CGI.unescapeHTML(agent.get_file(rss_url))
#    xml = File.read('public/feeds/' + rss_url)
   xml = agent.get_file(rss_url)
    puts xml

    render :xml => xml

  end

  def itunes

  end
end
