/** Coded by @gootibi (Tibor Balint) */

const movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

let movieData;

/** Select the canvas area */
let canvas = d3.select('#canvas');

/** Select the tooltip area */
let tooltip = d3.select('#tooltip');

/** Draw tree map functions */
const drawTreeMap = () => {
    /** Create d3 hierarchy */
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value'];
    }).sort((node1, node2) => {
        return node2['value'] - node1['value'];
    })

    /** Size and padding settings */
    let createTreeMap = d3.treemap()
        .size([1000, 600])
        .paddingInner(2)

    /** Data extraction */
    createTreeMap(hierarchy);

    let movieTiles = hierarchy.leaves()

    /** Create groups elements */
    let block = canvas.selectAll('g')
        .data(movieTiles)
        .enter()
        .append('g')
        .attr('transform', (movie) => {
            return `translate(${movie['x0']},${movie['y0']})`;
        })

    /** Create rectangles */
    block.append('rect')
        .attr('class', 'tile')
        /** Rectangle color settings */
        .attr('fill', (movie) => {
            let category = movie['data']['category']

            /** Categories color settings */
            if (category === 'Action') {
                return 'orange';
            } else if (category === 'Adventure') {
                return 'coral';
            } else if (category === 'Comedy') {
                return 'khaki';
            } else if (category === 'Drama') {
                return 'lightgreen';
            } else if (category === 'Animation') {
                return 'pink';
            } else if (category === 'Family') {
                return 'lightblue';
            } else if (category === 'Biography') {
                return 'tan';
            }
        })
        .attr('data-name', (movie) => {
            return movie['data']['name'];
        })
        .attr('data-category', (movie) => {
            return movie['data']['category'];
        })
        .attr('data-value', (movie) => {
            return movie['data']['value'];
        })
        /** Rectangle width and height settings */
        .attr('width', (movie) => {
            return `${movie['x1'] - movie['x0']}`
        })
        .attr('height', (movie) => {
            return `${movie['y1'] - movie['y0']}`
        })
        /** Tooltip and mosuse event (CSS styling => style.css) */
        /** Float legend creating */
        .on('mousemove', (event, movie) => {
            tooltip.style('opacity', 0.9);

            let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            tooltip
                .html(`${movie.data.name} - ${movie.data.category} <hr/> $${revenue}`)
                .attr('data-value', movie['data']['value'])
                .style('left', event.pageX + 15 + 'px')
                .style('top', event.pageY - 30 + 'px');
        })
        .on('mouseout', (event, movie) => {
            tooltip.style('opacity', 0);
        });

    /** Text onload in rectangles */    
    block.append('text')
        .attr('class', 'text')
        .selectAll('tspan')
        .data((movie) => {
            /** Line break  */
            let lineBreak = movie['data']['name'].split(/(?=[A-Z][^A-Z])/g);
            return lineBreak;
        })
        .enter()
        .append('tspan')
        .attr('x', 2)
        .attr('y', (movie, i) => {
            return 12 + i * 10;
        })
        .text((movie) => {
            return movie;
        });
};

/** Data fetching => movies data */
d3.json(movieDataUrl)
    .then((data) => {
        movieData = data;
        drawTreeMap();
    }).catch((err) => {
        console.error(err.message);
    });

