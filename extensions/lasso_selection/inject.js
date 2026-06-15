(function() {
    function showToast(message) {
        var toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.backgroundColor = 'rgba(20, 20, 25, 0.88)';
        toast.style.color = '#ffffff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '12px';
        toast.style.border = '1px solid rgba(153, 255, 213, 0.35)';
        toast.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(153, 255, 213, 0.15)';
        toast.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '500';
        toast.style.letterSpacing = '0.5px';
        toast.style.zIndex = '100000';
        toast.style.pointerEvents = 'none';
        toast.style.backdropFilter = 'blur(8px)';
        toast.style.webkitBackdropFilter = 'blur(8px)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        document.body.appendChild(toast);
        
        // Force reflow
        toast.offsetHeight;
        
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(function() {
                toast.remove();
            }, 400);
        }, 2500);
    }

    function initLassoExtension() {
        if (typeof ScriptsMorph === 'undefined' || typeof Morph === 'undefined') {
            setTimeout(initLassoExtension, 100);
            return;
        }

        if (window.lassoExtensionLoaded) {
            showToast("Lasso selection already active");
            return;
        }
        window.lassoExtensionLoaded = true;

        console.log("Snap! Workspace Lasso Selection extension successfully loaded.");

        // 1. Define the Lasso Selection Container Group Morph
        window.LassoGroupMorph = function() {
            this.init();
        };
        LassoGroupMorph.prototype = new Morph();
        LassoGroupMorph.prototype.constructor = LassoGroupMorph;
        LassoGroupMorph.uber = Morph.prototype;

        LassoGroupMorph.prototype.init = function () {
            LassoGroupMorph.uber.init.call(this);
            this.isDraggable = true;
            this.acceptsDrops = false;
            this.color = new Color(0, 0, 0, 0); // borderless/invisible
            this.borderColor = new Color(0, 0, 0, 0);
            this.border = 0;
        };

        LassoGroupMorph.prototype.add = function (aMorph) {
            LassoGroupMorph.uber.add.call(this, aMorph);
            this.highlightChild(aMorph);
            this.adjustGroupBounds();
        };

        LassoGroupMorph.prototype.removeChild = function (aMorph) {
            this.unhighlightChild(aMorph);
            LassoGroupMorph.uber.removeChild.call(this, aMorph);
            this.adjustGroupBounds();
        };

        LassoGroupMorph.prototype.adjustGroupBounds = function () {
            if (this.children.length === 0) { return; }
            var left = Infinity,
                top = Infinity,
                right = -Infinity,
                bottom = -Infinity;

            this.children.forEach(function(morph) {
                left = Math.min(left, morph.left());
                top = Math.min(top, morph.top());
                right = Math.max(right, morph.right());
                bottom = Math.max(bottom, morph.bottom());
            });

            var padding = 4;
            this.bounds = new Rectangle(
                left - padding,
                top - padding,
                right + padding,
                bottom + padding
            );
        };

        LassoGroupMorph.prototype.highlightChild = function (aMorph) {
            if (aMorph instanceof BlockMorph) {
                if (!aMorph.getHighlight()) {
                    aMorph.addHighlight(); // green-blueish activeHighlight glow
                }
            } else if (aMorph instanceof CommentMorph) {
                if (!aMorph.originalBorderColor) {
                    aMorph.originalBorderColor = aMorph.borderColor;
                }
                aMorph.borderColor = new Color(153, 255, 213);
                aMorph.border = 3;
                aMorph.changed();
            }
        };

        LassoGroupMorph.prototype.unhighlightChild = function (aMorph) {
            if (aMorph instanceof BlockMorph) {
                aMorph.removeHighlight();
            } else if (aMorph instanceof CommentMorph) {
                if (aMorph.originalBorderColor) {
                    aMorph.borderColor = aMorph.originalBorderColor;
                    delete aMorph.originalBorderColor;
                }
                aMorph.border = 1;
                aMorph.changed();
            }
        };

        LassoGroupMorph.prototype.unpack = function () {
            var scripts = this.parent;
            if (!scripts) { return; }
            this.children.slice().forEach(function(block) {
                this.removeChild(block);
                scripts.add(block);
            }, this);
            this.destroy();
        };

        LassoGroupMorph.prototype.userMenu = function () {
            var menu = new MenuMorph(this),
                myself = this;

            menu.addItem('duplicate', function() { myself.duplicate(); });
            menu.addItem('delete', function() { myself.confirmDelete(); });
            return menu;
        };

        LassoGroupMorph.prototype.duplicate = function () {
            var world = this.world(),
                dup = this.fullCopy();
            dup.pickUp(world);
        };

        LassoGroupMorph.prototype.confirmDelete = function () {
            this.destroy();
        };

        LassoGroupMorph.prototype.destroy = function () {
            var ide = this.parentThatIsA(IDE_Morph);
            this.children.slice().forEach(function(child) {
                if (child instanceof BlockMorph && ide) {
                    ide.stage.threads.stopAllForBlock(child);
                }
                child.destroy();
            });
            LassoGroupMorph.uber.destroy.call(this);
        };

        // 2. Patch Selection Toggling on Morph.prototype
        Morph.prototype.toggleSelection = function () {
            var scripts = this.parentThatIsA(ScriptsMorph);
            if (!scripts) { return; }

            var group = this.parentThatIsA(LassoGroupMorph);
            if (group) {
                group.removeChild(this);
                scripts.add(this);
                if (group.children.length === 0) {
                    group.destroy();
                }
            } else {
                var existingGroup = scripts.children.find(function(child) {
                    return child instanceof LassoGroupMorph;
                });
                if (existingGroup) {
                    existingGroup.add(this);
                } else {
                    var newGroup = new LassoGroupMorph();
                    newGroup.add(this);
                    scripts.add(newGroup);
                }
            }
            scripts.changed();
        };

        // 3. Patch Hand modifiers to track Alt-clicks
        var originalMouseDown = HandMorph.prototype.processMouseDown;
        HandMorph.prototype.processMouseDown = function (ev) {
            this.altPressed = (ev && ev.altKey) || false;
            originalMouseDown.apply(this, arguments);
        };

        var originalMouseUp = HandMorph.prototype.processMouseUp;
        HandMorph.prototype.processMouseUp = function (ev) {
            var eventObj = ev || arguments[0] || {};
            this.altPressed = eventObj.altKey || false;
            originalMouseUp.apply(this, arguments);
        };

        // Patch Morph.prototype.rootForGrab
        var originalMorphRootForGrab = Morph.prototype.rootForGrab;
        Morph.prototype.rootForGrab = function () {
            var group = this.parentThatIsA(LassoGroupMorph);
            if (group) {
                return group;
            }
            return originalMorphRootForGrab.apply(this, arguments);
        };

        // Patch Morph.prototype.contextMenu
        var originalMorphContextMenu = Morph.prototype.contextMenu;
        Morph.prototype.contextMenu = function () {
            var group = this.parentThatIsA(LassoGroupMorph);
            if (group) {
                return group.userMenu();
            }
            return originalMorphContextMenu.apply(this, arguments);
        };

        // 4. Intercept Block and Comment clicks
        var originalBlockRootForGrab = BlockMorph.prototype.rootForGrab;
        BlockMorph.prototype.rootForGrab = function () {
            var group = this.parentThatIsA(LassoGroupMorph);
            if (group) {
                return group;
            }
            return originalBlockRootForGrab.apply(this, arguments);
        };

        var originalBlockMouseClickLeft = BlockMorph.prototype.mouseClickLeft;
        BlockMorph.prototype.mouseClickLeft = function () {
            var altClicked = this.world().hand.altPressed;
            if (altClicked && !this.isTemplate) {
                this.toggleSelection();
                return;
            }
            originalBlockMouseClickLeft.apply(this, arguments);
        };

        var originalCommentMouseClickLeft = CommentMorph.prototype.mouseClickLeft;
        CommentMorph.prototype.mouseClickLeft = function () {
            var altClicked = this.world().hand.altPressed;
            if (altClicked) {
                this.toggleSelection();
                return;
            }
            originalCommentMouseClickLeft.apply(this, arguments);
        };

        // 5. Override Workspace Lasso Selection Events
        var originalScriptsMouseDownLeft = ScriptsMorph.prototype.mouseDownLeft;
        ScriptsMorph.prototype.mouseDownLeft = function (pos) {
            var shiftClicked = this.world().currentKey === 16;
            if (shiftClicked) {
                return originalScriptsMouseDownLeft.apply(this, arguments);
            }

            var groups = this.children.filter(function(child) {
                return child instanceof LassoGroupMorph;
            });
            if (groups.length > 0) {
                groups.forEach(function(group) {
                    group.unpack();
                });
                this.changed();
                return;
            }

            if (this.focus) { this.focus.stopEditing(); }

            this.lassoStart = pos;
            this.lassoFeedback = new BoxMorph();
            this.lassoFeedback.color = new Color(153, 255, 213, 0.12);
            this.lassoFeedback.borderColor = new Color(153, 255, 213, 0.85);
            this.lassoFeedback.border = 2;
            this.lassoFeedback.setPosition(pos);
            this.lassoFeedback.setExtent(new Point(0, 0));
            this.add(this.lassoFeedback);

            this.lockMouseFocus();
        };

        // Patch ScriptsMorph.prototype.mouseMove to resize feedback rectangle
        var originalScriptsMouseMove = ScriptsMorph.prototype.mouseMove;
        ScriptsMorph.prototype.mouseMove = function (pos) {
            if (this.lassoStart && this.lassoFeedback) {
                var rect = this.lassoStart.rectangle(pos);
                this.lassoFeedback.changed();
                this.lassoFeedback.bounds = rect;
                this.lassoFeedback.changed();
            } else if (originalScriptsMouseMove) {
                originalScriptsMouseMove.apply(this, arguments);
            }
        };

        // Patch ScriptsMorph.prototype.mouseClickLeft
        var originalScriptsMouseClickLeft = ScriptsMorph.prototype.mouseClickLeft;
        ScriptsMorph.prototype.mouseClickLeft = function (pos) {
            var shiftClicked = this.world().currentKey === 16;
            if (shiftClicked) {
                return originalScriptsMouseClickLeft.apply(this, arguments);
            }
            if (this.focus) { this.focus.stopEditing(); }

            if (this.lassoStart && this.lassoFeedback) {
                var rect = this.lassoFeedback.bounds;
                this.lassoFeedback.destroy();
                this.lassoFeedback = null;
                this.lassoStart = null;

                if (rect.width() < 5 || rect.height() < 5) {
                    return;
                }

                var selected = [];
                this.children.forEach(function(child) {
                    if ((child instanceof BlockMorph || child instanceof CommentMorph) &&
                        child.bounds.intersects(rect)) {
                        selected.push(child);
                    }
                });

                if (selected.length > 0) {
                    var left = Infinity,
                        top = Infinity,
                        right = -Infinity,
                        bottom = -Infinity;

                    selected.forEach(function(morph) {
                        left = Math.min(left, morph.left());
                        top = Math.min(top, morph.top());
                        right = Math.max(right, morph.right());
                        bottom = Math.max(bottom, morph.bottom());
                    });

                    var padding = 4;
                    var groupBounds = new Rectangle(
                        left - padding,
                        top - padding,
                        right + padding,
                        bottom + padding
                    );

                    var group = new LassoGroupMorph();
                    group.bounds = groupBounds;

                    selected.forEach(function(child) {
                        group.add(child);
                    });

                    this.add(group);
                    this.changed();
                }
            }
        };

        var originalScriptsWantsDropOf = ScriptsMorph.prototype.wantsDropOf;
        ScriptsMorph.prototype.wantsDropOf = function (aMorph) {
            if (aMorph instanceof LassoGroupMorph) {
                return true;
            }
            return originalScriptsWantsDropOf.apply(this, arguments);
        };

        var originalScriptsToXML = ScriptsMorph.prototype.toXML;
        ScriptsMorph.prototype.toXML = function (serializer) {
            this.children.filter(function(child) {
                return child instanceof LassoGroupMorph;
            }).forEach(function(group) {
                group.unpack();
            });
            return originalScriptsToXML.apply(this, arguments);
        };

        // 6. Bind Global Backspace/Delete Shortcut
        window.addEventListener("keydown", function(event) {
            if (event.keyCode === 8 || event.keyCode === 46) {
                var worldObj = window.world;
                if (!worldObj) return;
                var focus = worldObj.keyboardFocus;
                var isEditingText = focus && (
                    focus instanceof CursorMorph ||
                    (typeof ScriptFocusMorph !== 'undefined' && focus instanceof ScriptFocusMorph) ||
                    focus.isEditable === true ||
                    (focus.parent && focus.parent.isEditable === true)
                );
                if (!isEditingText) {
                    var ide = worldObj.children[0];
                    if (ide && ide.currentSprite && ide.currentSprite.scripts) {
                        var scripts = ide.currentSprite.scripts;
                        var groups = scripts.children.filter(function(child) {
                            return child instanceof LassoGroupMorph;
                        });
                        if (groups.length > 0) {
                            event.preventDefault();
                            groups.forEach(function(group) {
                                group.confirmDelete();
                            });
                        }
                    }
                }
            }
        }, true);

        showToast("Lasso selection active");
    }

    initLassoExtension();
})();
