UPM.define('jqueryCloudCarousel',
    [
        'jquery',
    ],
    function($) {

    /**
     * Turn an element with child images in containers into an image carousel
     * Usage: $jqueryObject.cloudCarousel(options)
     * @method cloudCarousel
     * @param {Object} options Options for this plugin
     */
    $.fn.cloudCarousel = function(options) {
        options = options || {};

        if (this.isCarousel) {
            console && console.warn('Attempted to initialize carousel, but element is already a carousel.');
            return;
        }

        var $carousel = this,
            selector = options.selector || '.carousel-item-wrap',
            $containers = this.find(selector),
            containerCount = $containers.length,
            loneWolf = containerCount === 1,

            // Available options
            dimensions = {
                carousel: {
                    width: options.width || 745,
                    height: options.height || 288
                },
                center: {
                    top: 0,
                    width: options.centerWidth || 560,
                    height: options.centerHeight || 274
                },
                scaled: {
                    width: options.scaledWidth || 478,
                    height: options.scaledHeight || 234
                }
            },
            animateTime = options.animateTime || 500,
            animated = options.animated || true,
            autorotate = options.autorotate || false,
            autorotateTime = options.autorotateTime || 4000,
            containerPadding = options.containerPadding || 14,
            sideOpacity = options.sideOpacity || 0.2,

            // Internal variables
            imagesLoaded = 0,
            index = -1,
            imageSlideTime = Math.floor(animateTime / 2),
            sliders = [],
            hovered = false;

        // Perform some calculations for each image position
        dimensions.ratio = dimensions.center.width / dimensions.center.height;

        dimensions.scaled.left = dimensions.carousel.width - (dimensions.scaled.width + containerPadding);
        dimensions.scaled.top = Math.round((dimensions.carousel.height - (dimensions.scaled.height + containerPadding)) / 2);

        dimensions.center.left = Math.round((dimensions.carousel.width - (dimensions.center.width + containerPadding)) / 2);

        dimensions.back = {
            width: dimensions.scaled.width,
            height: dimensions.scaled.height,
            top: Math.round((dimensions.carousel.height - (dimensions.scaled.height + containerPadding)) / 2),
            left: Math.round((dimensions.carousel.width - (dimensions.scaled.width + containerPadding)) / 2)
        };

        this.isCarousel = true;

        // Public functions

        /**
         * Rotate a the carousel one image to the right
         * @method rotateRight
         */
        this.rotateRight = function() {
            this.rotate(1, !animated);
            return this;
        };

        /**
         * Rotate a the carousel one image to the left
         * @method rotateLeft
         */
        this.rotateLeft = function() {
            this.rotate(-1, !animated);
            return this;
        };

        /**
         * Rotate the carousel in a direction, and optionally specify animation
         * @param {Number} direction The number of images to rotate away from center (can be negative)
         * @param {Boolean} noAnimation Whether or not to animate the transitions
         * @method rotate
         */
        this.rotate = function(direction, noAnimation, init) {
            var zindex = 1;
            if (!init) {
                zindex = direction;
            }
            // Get the index of the new center image
            index = wrap(index + direction);

            // We won't have an item to move to the back if we only have 3 items
            if (sliders.length > 3) {
                sliders[wrap(index - (zindex * 2))].go('back', direction, noAnimation);
            }
            sliders[index].go('center', zindex, noAnimation);
            sliders[wrap(index + 1)].go('right', zindex, noAnimation);
            sliders[wrap(index - 1)].go('left', zindex, noAnimation);

            this.index = index;
        };


        /**
         * Set all the initial data required for the carousel. Right now should only be called once. Otherwise, doom.
         * @method update
         */
        this.update = function() {
            var $parent,
                $first,
                startIndex = options.startIndex || 0;

            if (!containerCount) {
                return this;
            }

            // determine the index of displayed banners based on startIndex
            if (startIndex >= containerCount || startIndex < 0) {
                startIndex = 0;
            }

            this.css({
                height: dimensions.carousel.height,
                width: dimensions.carousel.width
            });

            // If there are only two images we want to make the side images duplicate each other so you can
            // spin forever. That means we need 4 images total to make the 2 images cycle every other image
            if (containerCount === 2) {
                $first = $containers.eq(0);
                $parent = $first.parent();

                $first.clone(true).appendTo($parent);
                $containers.eq(1).clone(true).appendTo($parent);

                this.refreshData();
            }

            // Initialize all our sliders and hide any images that aren't the first two or the last one
            $containers.each(function(i) {
                var next = $carousel.makeSlider(i, $(this));

                // If we only have one image, send it to the center
                if (loneWolf) {
                    next.go('center', 0 , true);
                } else if (i != startIndex && i != wrap(startIndex + 1) && i != wrap(startIndex - 1)) {
                    next.go('back', 0, true);
                }
                sliders.push(next);
            });

            // Start the show! Passing in true (noAnimation) means just put the 3 main images into place
            this.resume();

            // rotate carousel into startIndex
            if (!loneWolf) {
                this.rotate(1 + startIndex, true, true);
            }

            // setup autorotate
            if (autorotate) {
                $carousel.hover(function() {
                    hovered = true;
                }, function() {
                    hovered = false;
                });
                setInterval(function() {
                    if (autorotate && !hovered) {
                        $carousel.rotateRight();
                        options.click && options.click.call(this, window.event, $carousel.getSlider('right'));
                    }
                }, autorotateTime);
            }

            return this;
        };

        this.insertAfter = function(idx, $container) {
            var newContainer = $carousel.makeSlider(containerCount, $container);

            newContainer.go('back', 0, true);
            if (idx === containerCount - 1) {
                sliders.push(newContainer);
            } else {
                sliders.splice(idx+1, 0, newContainer);
            }

            // refresh carousel data
            insertAfterIndex(idx, $container);
            this.refreshData();
        };

        this.refreshData = function() {
            $containers = $carousel.find(selector);
            containerCount = $containers.length;
            for(var i= 0,ii=sliders.length; i<ii; i++) {
                if (sliders[i].position === 'center') {
                    index = i;
                }
            }
        };

        /*
         * Create an object representing one thing in the carousel
         * @param {HTMLElement} The container around the image
         * @method makeSlider
         */
        this.makeSlider = function(idx, $container) {
            var $img = $container.find('img').css('opacity', 0),
                img = $img.get(0);

            /**
             * Defers the calling of imageLoaded until this function
             * has completed as the imageLoaded function has references
             * to `sliders` which is not initialized until this function
             * has completed executing.
             */
            function deferCallingImageLoaded() {
                setTimeout(function() {
                    imageLoaded($img, idx);
                }, 1);
            }

            // Cached image check https://github.com/peol/jquery.imgloaded/blob/master/ahpi.imgload.js
            // endorsed by mr paul irish
            if(img.complete || img.readyState === 4) {
                // trigger load event after carousel has finished initializing / assigning each image
                // its position
                deferCallingImageLoaded()
            } else {
                $img.load(deferCallingImageLoaded);
                $img.attr('src', $img.attr('src'));
            }

            return {
                $container: $container,
                $img: $img,
                index: idx,
                // Rotate the image to the proper position
                go: function(position, direction, noAnimation) {
                    var type = position == 'right' || position == 'left' ? 'scaled' : position,
                        $container = this.$container,
                        imgData = this.$img.data('loaded'),
                        imgPosition = {},
                        newPosition = {
                            height: dimensions[type].height,
                            width: dimensions[type].width,
                            left: (position == 'left' ? 0 : dimensions[type].left),
                            top: dimensions[type].top
                        },
                        that = this;

                    $container.show().css({
                        'z-index': {center: 5, left: 3 + direction, right: 3 - direction, back: 0}[position]
                    }).data('position', position).removeClass('center left right back').addClass(position);

                    this.position = position;

                    if (noAnimation) {
                        $container.css(newPosition);
                    } else {
                        $container.animate(newPosition, {
                            duration: animateTime,
                            queue: false
                        });
                    }

                    // Potential hack to trigger image smoothing in Chrome
                    if (!noAnimation && position === 'center') {
                        setTimeout(function() {
                            $container.hide().show();
                        }, animateTime + 10);
                    }

                    // Only bother animating the opacity if it's loaded
                    if (imgData) {
                        if (position !== 'back') {
                            imgPosition.left = imgData[position].left;
                            imgPosition.top = imgData[position].top;
                        }

                        imgPosition.opacity = (position == 'center') ? 1 : sideOpacity;

                        if (noAnimation) {
                            this.$img.css(imgPosition);

                            // If we don't animate and this image is going to the back, hide it
                            position == 'back' && $container.hide();
                        } else {
                            this.$img.animate(imgPosition, {
                                duration: animateTime,
                                queue: false,
                                complete: function() {
                                    if (that.position === 'center') {
                                        $carousel.trigger('rotated');
                                    } else if (that.position === 'back') {
                                        $container.hide();
                                    }
                                }
                            });
                        }
                    }
                }
            };
        };

        /**
         * Grey out the carousel and stop click events
         * @method pause
         */
        this.pause = function() {
            $carousel.css('opacity', sideOpacity).undelegate(selector, 'click', clickHandler);
            return $carousel;
        };

        /**
         * Wire up clicking on anything and ungray the carousel
         * @method pause
         */
        this.resume = function() {
            $carousel.css('opacity', 1).delegate(selector, 'click', clickHandler);
            return $carousel;
        };

        /*
         * Get a slider (pony on a stick) at any index
         * @param {Number} The index
         * @return {HTMLElement} The DOM element for the slider
         * @method makeSlider
         */
        this.getSlider = function(position) {
            var i = 0,
                slider;

            if (typeof position === 'number') {
                return sliders[position];
            }

            for(; slider = sliders[i++];) {
                if (slider.position === position) {
                    return slider;
                }
            }

            return false;
        };

        // Private functions

        var insertAfterIndex = function(i, $container) {
            if (i === 0) {
                $carousel.prepend($container);
            } else if (i === containerCount - 1) {
                $carousel.append($container);
            } else {
                $('li:nth-child(' + (i + 1) + ')', $carousel).after($container);
            }
        };

        /**
         * Respond to cliks on the carousel
         * @param {Event} e The click event
         * @method clickHandler
         */
        var clickHandler = function(e) {
            var $this = $(this),
                position = $this.data('position');

            // If this isn't the center image we want to rotate. Otherwise trigger any assigned events
            if (position !== 'center') {
                e.preventDefault();
                if (position == 'left') {
                    $carousel.rotateLeft();
                } else {
                    $carousel.rotateRight();
                }
            }
            autorotate = false;
            options.click && options.click.call(this, e, $carousel.getSlider(position));
        };

        /**
         * Wrap a number between 0 and the total number of containers
         * @param {Number} num The number to wrap
         * @method wrap
         */
        var wrap = function(num) {
            if (num < 0) {
                return containerCount + num;
            }
            return num % containerCount;
        };

        /**
         * Listen for image loading events
         * @param {HTMLElement} The image that loaded
         * @method imageLoaded
         */
        var imageLoaded = function($img, idx) {
            var $row = $img.closest(selector),
                height = $img.get(0).clientHeight,
                width = $img.get(0).clientWidth,
                ratio = width / height,
                // Once we know the image dimensions, we can precalculate where to move the image in the side wings
                loadedData = {
                    center: {
                        left: Math.round((dimensions.center.width - (dimensions.center.height * ratio)) / 2),
                        top: 0
                    },
                    right: {
                        left: dimensions.scaled.width - Math.round(dimensions.scaled.height * ratio),
                        top: 0
                    },
                    left: {
                        left: 0,
                        top: 0
                    }
                },
                position;

            // Change it to width preference scaling if needed
            if (ratio > dimensions.ratio) {
                $img.css({
                    width: '100%',
                    height: 'auto'
                });
                loadedData.center.left = 0;
                loadedData.center.top = Math.round((dimensions.center.height - (dimensions.center.width / ratio)) / 2);

                loadedData.right.left = 0;
                loadedData.left.top = loadedData.right.top = Math.round((dimensions.scaled.height - (dimensions.scaled.width / ratio)) / 2);
            }
            $img.data('loaded', loadedData);

            // Then find the parent and get its position so we know if this image should be faded in
            position = sliders[idx].position;

            // On load we need to put the image in its proper place, eg right floated if it loads in the right
            // container, etc
            if (position  !== 'back') {
                $img.css('left', loadedData[position].left);
                $img.css('top', loadedData[position].top);
            }

            if (position && position !== 'back') {
                $img.animate({opacity: position == 'center' ? 1 : sideOpacity});
            }

            if (++imagesLoaded == sliders.length) {
                $carousel.trigger('loaded');
            }
        };

        this.update();

        return this;
    };
});