// Upload Asset - Minimal JavaScript (Only for interactions)

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initMinimalFunctions();
    });

    function initMinimalFunctions() {
        // Toggle pricing section on asset type change
        const paidRadio = document.getElementById('paidAsset');
        const freeRadio = document.getElementById('freeAsset');
        const pricingSection = document.getElementById('pricingSection');

        if (paidRadio && freeRadio && pricingSection) {
            paidRadio.addEventListener('change', function() {
                pricingSection.style.display = 'block';
            });

            freeRadio.addEventListener('change', function() {
                pricingSection.style.display = 'none';
            });
        }

        // Tag input - add on Enter key
        const tagInput = document.querySelector('.tag-input');
        if (tagInput) {
            tagInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const tag = tagInput.value.trim();
                    
                    if (tag) {
                        const tagContainer = document.querySelector('.tag-container');
                        const newTag = document.createElement('span');
                        newTag.className = 'tag-item';
                        newTag.innerHTML = `${tag} <button type="button" class="tag-remove">×</button>`;
                        tagContainer.insertBefore(newTag, tagInput);
                        tagInput.value = '';
                    }
                }
            });
        }

        // Remove tag on click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-remove')) {
                e.target.closest('.tag-item').remove();
            }
        });
    }

})();