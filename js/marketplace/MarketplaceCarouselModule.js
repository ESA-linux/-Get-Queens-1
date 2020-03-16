/**
 * Manages the carousel display on the Marketplace search page.
 */
UPM.define("MarketplaceCarouselModule",
    [
        'jquery',
        'UpmEnvironment',
        'jqueryCloudCarousel'
    ],
    function($,
             environment) {

        "use strict";

        var carouselLoaded = false;
        var carouselData = {};
        
        var MarketplaceCarouselModule = {
            load: function() {
                if (!carouselLoaded) {
                    carouselLoaded = true;
                    if ($('#carousel').length) {
                        var url = environment.getResourceUrl('banners');
                        if (url) {
                            $.ajax({
                                url: url,
                                dataType: 'json',
                                success: function(response) {
                                    // Only load banners if we have at least 3
                                    if (response && response.count && response.count > 3) {
                                        initCarousel(response);
                                    }
                                    UPM.trace('marketplace-carousel-ready');
                                }
                            });
                        }
                    }
                }
            }
        };

        function initCarousel(rep) {
            var carousel = $('<ul class="cloud-carousel"></ul>'),
                carouselContainer = $('#carousel'),
                banner,
                firstSlider,
                bannersCount = rep.banners.length;

            carouselData = {
                head: 0,
                tail: 0,
                prev: rep.links.prev,
                next: rep.links.next,
                total: rep.count
            };

            for (var i = 0; banner = rep.banners[i++];) {
                if (banner.image && banner.image.links['binary']) {
                    carousel.append(newCarouselItem(banner));
                }
            }

            carouselData.tail = $('.carousel-item-wrap', carousel).size() - 1;
            carouselContainer.html(carousel);

            // Then initialize the carousel
            firstSlider = carousel.cloudCarousel({
                // start at a random place within the first page of the banners
                startIndex: Math.floor(Math.min(Math.max(2, Math.random() * bannersCount), bannersCount - 2)),
                autorotate: true,
                // On clicking the center item, expand that plugin
                click: function(e, slider) {
                    var position = slider.position;

                    if (position === 'left' || position === 'right') {
                        if ($('.carousel-item-wrap', carousel).size() < carouselData.total) {
                            if ($('.carousel-item-wrap:eq(' + carouselData.head + ')').hasClass('left')) {
                                loadNewBanners(true, carousel);
                            } else if ($('.carousel-item-wrap:eq(' + carouselData.tail + ')').hasClass('right')) {
                                loadNewBanners(false, carousel);
                            }
                        }
                    }
                }
             // When all images are done loading, remove the loading spinner
            }).bind('loaded', function() {
                firstSlider.removeClass('loading');
            }).getSlider(0).$container.find('a').addClass('loading');
        }

        function newCarouselItem(banner) {
            var item = $('<li class="carousel-item-wrap"></li>')
                    .attr('data-expand', banner.pluginKey)
                    .attr('data-rest-uri', banner.links.self),
                link = $('<a href="" class="carousel-item"></a>'),
                image = $('<img>').attr('src', banner.image.links['binary']).attr('alt', banner.image.altText);

            link.addClass("push-state").attr("href", banner.links.singlePluginViewLink);

            return item.append(link.append(image));
        }

        function loadNewBanners(prev, carousel) {
            var currentTail = carouselData.tail,
                url = carouselData.next,
                banner;

            if (prev) {
                url = carouselData.prev;
            }

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; banner = response.banners[i++];) {
                        if (banner.image && banner.image.links['binary']) {
                            carousel.insertAfter(currentTail + i - 1, $(newCarouselItem(banner)));
                            if (prev) {
                                carouselData.head = carouselData.tail + 1;
                            } else {
                                carouselData.tail = carouselData.tail + 1;
                            }
                        }
                    }
                    if (prev) {
                        carouselData.prev = response.links.prev;
                    } else {
                        carouselData.next = response.links.next;
                    }
                }
            });
        }

        return MarketplaceCarouselModule;
    }
);