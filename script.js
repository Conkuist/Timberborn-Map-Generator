function World(x, y, heights, water, grass, entities)
{
    this.GameVersion = "v20211021-3d6b9df-sw";
    this.Timestamp = (new Date).toISOString().split(".")[0].replace("T", " ");
    this.Singletons = {
        MapSize: {
            Size: {
                X: x,
                Y: y
            }
        },
        TerrainMap: {
            Heights: {
                Array: heights.join(" ")
            }
        },
        CameraStateRestorer: {
            SavedCameraState: {
                Target: {
                    X: 70,
                    Y: 0,
                    Z: 70
                },
                ZoomLevel: 8,
                HorizontalAngle: 45,
                VerticalAngle: 30,
            }
        },
        WaterMap: {
            WaterDepths: {
                Array: water.join(" ")  //heights.map(e => e = "0").join(" ")
            },
            Outflows: {
                Array: heights.map(e => e = "0:0:0:0").join(" ")
            }
        },
        SoilMoistureSimulator: {
            MoistureLevels: {
                Array: grass.join(" ")   //heights.map(e => e = "0").join(" ")
            }
        }
    },
        this.Entities = entities;
}

function Maple(x, y, z)
{
    return JSON.parse(`{
			"Id": "${UUID()}",
			"Template": "Maple",
			"Components": {
				"BlockObject": {
					"Coordinates": {
						"X": ${x},
						"Y": ${y},
						"Z": ${z}
					}
				},
				"Growable": {
					"GrowthProgress": 1.0
				},
				"CoordinatesOffseter": {
					"CoordinatesOffset": {
						"X": ${(Math.random() / 2) - 0.25},
						"Y": ${(Math.random() / 2) - 0.25}
					}
				},
				"NaturalResourceModelRandomizer": {
					"Rotation": ${Math.random() * 360},
					"DiameterScale": ${0.75 + (Math.random() / 2)},
					"HeightScale": ${0.75 + (Math.random() / 2)}
				},
				"Yielder:Cuttable": {
					"Yield": {
						"Good": {
							"Id": "Log"
						},
						"Amount": 8
					}
				},
				"GatherableYieldGrower": {
					"GrowthProgress": 0.0
				}
			}
		}`);
}

function BlueberryBush(x, y, z)
{
    return JSON.parse(`{
			"Id": "${UUID()}",
			"Template": "BlueberryBush",
			"Components": {
				"BlockObject": {
					"Coordinates": {
						"X": ${x},
						"Y": ${y},
						"Z": ${z}
					}
				},
				"Growable": {
					"GrowthProgress": 1.0
				},
				"CoordinatesOffseter": {
					"CoordinatesOffset": {
						"X": ${(Math.random() / 2) - 0.25},
						"Y": ${(Math.random() / 2) - 0.25}
					}
				},
				"NaturalResourceModelRandomizer": {
					"Rotation": ${Math.random() * 360},
					"DiameterScale": ${0.75 + (Math.random() / 2)},
					"HeightScale": ${0.75 + (Math.random() / 2)}
				},
				"Yielder:Gatherable": {
					"Yield": {
						"Good": {
							"Id": "Berries"
						},
						"Amount": 3
					}
				},
				"GatherableYieldGrower": {
					"GrowthProgress": 1
				}
			}
		}`)
}

function RuinColumn(x, y, z, h, v) {

    switch (h) {
        case 1:
            height = 1;
            break;
        case 2:
            height = 2;
            break;
        case 3:
            height = 3;
            break;
        case 4:
            height = 4;
            break;
        case 5:
            height = 5;
            break;
        case 6:
            height = 6;
            break;
        case 7:
            height = 7;
            break;
        case 8:
            height = 8;
            break;
        default:
            height = 1;
            break;
    }

    switch (v) {
        case 0:
            variant = "A";
            break;
        case 1:
            variant = "B";
            break;
        case 2:
            variant = "C";
            break;
        case 3:
            variant = "D";
            break;
        case 4:
            variant = "E";
            break;
        default:
            variant = "A";
            break;
    }

    return JSON.parse(`{
			"Id": "${UUID()}",
			"Template": "RuinColumnH${height}",
			"Components": {
				"BlockObject": {
					"Coordinates": {
						"X": ${x},
						"Y": ${y},
						"Z": ${z}
					}
				},
				"Yielder:Ruin": {
					"Yield": {
						"Good": {
							"Id": "ScrapMetal"
						},
						"Amount": ${height * 15}
					}
				},
				"RuinModels": {
					"VariantId": "${variant}"
				},
                "DryObject": {
                    "IsDry": true
                }
			}
		}`);
}

function UUID()
{
    return window.URL.createObjectURL(new Blob([])).split('/').pop();
}

var width = 256;
var length = 256;
var height = 16;

var waterLevel = 7.5;

var res = 2;

var s = 2;

random = Math.random();

var data = [];
var water = [];
var grass = [];
var entities = [];

function Save() {

    var json = JSON.stringify(new World(width, length, data, water, grass, entities), null, 4);

    var blob = new Blob([json], {

        type: 'application/json'

    });

    var url = URL.createObjectURL(blob);
    save = document.createElement("a");
    save.href = url;
    save.download = "world.json";
    save.click();

}

canvas = document.createElement("canvas")
document.body.appendChild(canvas);
canvas.width = width * res;
canvas.height = length * res;

buttons = document.createElement("div");
buttons.classList.add("buttons");
document.body.appendChild(buttons);

generate = document.createElement("button");
buttons.appendChild(generate);
generate.innerHTML = "Generate New"
generate.addEventListener("click",function() {
    random = Math.random();
    seed.value = random;
    GenerateMap();
})

mapWidth = document.createElement("input");
buttons.appendChild(mapWidth);
mapWidth.classList.add("size");
mapWidth.value = width
mapWidth.type = "number";
mapWidth.min = 1;
mapWidth.max = 1024;
mapWidth.addEventListener("change",function() {
    width = this.value;canvas.width = width * res;
    GenerateMap();
})

mapLength = document.createElement("input");
buttons.appendChild(mapLength);
mapLength.classList.add("size");
mapLength.value = length
mapLength.type = "number";
mapLength.min = 1;
mapLength.max = 1024;
mapLength.addEventListener("change",function() {
    length = this.value;canvas.height = length * res;
    GenerateMap();
})

mapWaterLevel = document.createElement("input");
buttons.appendChild(mapWaterLevel);
mapWaterLevel.classList.add("size");
mapWaterLevel.value = waterLevel
mapWaterLevel.type = "number";
mapWaterLevel.min = 0;
mapWaterLevel.max = 16;
mapWaterLevel.step = 0.5;
mapWaterLevel.addEventListener("change",function() {
    waterLevel = parseFloat(this.value);
    GenerateMap();
})

zoomIn = document.createElement("button");
buttons.appendChild(zoomIn);
zoomIn.classList.add("zoom");
zoomIn.innerHTML = "+"
zoomIn.addEventListener("click",function() {
    res++;
    canvas.width = width * res;
    canvas.height = length * res;
    GenerateMap();
})

save = document.createElement("button");
buttons.appendChild(save);
save.classList.add("save");
save.innerHTML = "Save World"
save.addEventListener("click",Save)

seed = document.createElement("input");
buttons.appendChild(seed);
seed.classList.add("seed");
seed.value = random;
seed.addEventListener("input",function(){
    if(!isNaN(Number(this.value))/* && this.value <= 1 && this.value >= 0*/)
    {
        random = this.value;
        GenerateMap();
    }
    else
    {
        console.log(typeof this.value === 'number',this.value <= 1,this.value >= 0)
    }
})

zoomOut = document.createElement("button");
buttons.appendChild(zoomOut);
zoomOut.classList.add("zoom");
zoomOut.innerHTML = "-"
zoomOut.addEventListener("click",function() {
    if(res > 1) {
        res--;
        canvas.width = width * res;
        canvas.height = length * res;
        GenerateMap();
    }
})

ctx = canvas.getContext("2d");

GenerateMap();

function GenerateMap()
{
    map = NoiseMap(width,length);

    plants = NoiseMap(width, length, 10, 4);

    trees = plants.map(e => e.map(f => f > 0.6 ? true : false));
    berries = plants.map(e => e.map(f => f > 0.4 ? false : true));
    ruins =  plants.map(e => e.map(f => f > 0.2 ? false : true));

    data = [];
    water = [];
    grass = [];
    entities = [];

    for (let y = 0; y < length; y++)
    {
        for (let x = 0; x < width; x++) {

            if (x % 2 == y % 2) {
                ctx.fillStyle = "magenta";
            } else {
                ctx.fillStyle = "black";
            }

            noise = map[x][y];

            mapHeight = Math.round(noise * 16);

            data[y * length + x] = mapHeight;

            //Set Water Depth
            if(mapHeight < waterLevel)
            {
                water[y * length + x] = waterLevel - mapHeight;
                ctx.fillStyle = `hsl(200, 100%, ${((16 - waterLevel + mapHeight) / 2) * (100 / 16)}%)`
            }
            else
            {
                water[y * length + x] = 0;
            }

            //Set Moisture Level
            if(mapHeight < Math.ceil(waterLevel) + 2 && waterLevel != 0)
            {
                grass[y * length + x] = 16;
            }
            else
            {
                grass[y * length + x] = 0;
            }

            //Place Trees and Bushes
            if(mapHeight >= waterLevel && mapHeight < Math.ceil(waterLevel) + 2 && waterLevel != 0)
            {
                ctx.fillStyle = `hsl(75, 100%, ${mapHeight * (100 / 16)}%)` //`hsl(100, 100%, ${(4 + mapHeight / 2) * (100 / 16)}%)`

                if(trees[x][y])
                {
                    entities.push(Maple(x, y, mapHeight));
                    ctx.fillStyle = `hsl(25, 25%, 25%)`;
                }

                if(berries[x][y])
                {
                    entities.push(BlueberryBush(x, y, mapHeight));
                    ctx.fillStyle = `hsl(260, 100%, 25%)`;
                }
            }

            //Place Ruins
            if(mapHeight >= Math.ceil(waterLevel) + 2 || waterLevel == 0)
            {
                ctx.fillStyle = `hsl(25, 50%, ${mapHeight * (100/16)}%)` //`hsl(25, 25%, ${(4 + mapHeight / 2) * (100/16)}%)`

                if(/*Math.floor((x + 1) / 4) % 16 == 0 && Math.floor((y + 2) / 4) % 16 == 0*/ruins[x][y])
                {
                    entities.push(RuinColumn(x, y, mapHeight, Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 5)));
                    ctx.fillStyle = `hsl(0, 50%, 50%)`
                }
            }

            ctx.fillRect(x * res, (length - 1 - y) * res, res, res);
        }
    }

}

function Noise(x, y)
{
    return fract(Math.sin(x * 100 + y * 6574 * random) * 5647);
}

function SmoothNoise(x, y)
{
    ax = fract(x);
    ay = fract(y);
    bx = Math.floor(x);
    by = Math.floor(y);

    ax = ax * ax * (3 - 2 * ax);
    ay = ay * ay * (3 - 2 * ay);

    p1 = Noise(bx, by);
    p2 = Noise(bx + 1, by);
    m1 = mix(p1, p2, ax);

    p3 = Noise(bx, by + 1)
    p4 = Noise(bx + 1, by + 1);
    m2 = mix(p3, p4, ax);

    return mix(m1, m2, ay);

}

function NoiseMap(width, height, scale, octaves) {

    var noiseMap = [];

    var max = -100;
    var min = 100

    if(!(scale && scale != 0))
    {
        scale = 40; // not 0
    }
    if(!(octaves && octaves > 0))
    {
        octaves = 2;
    }

    const persitance = 0.5; // smaller than 1
    const lacunarity = 2; // larger than 1

    for (let x = 0; x < width; x++)
    {

        noiseMap[x] = [];

        for (let y = 0; y < height; y++)
        {

            var amplitude = 1;
            var frequency = 1;
            var noiseHeight = 1;

            for (let i = 0; i < octaves; i++)
            {

                const sx = x / scale * frequency;
                const sy = y / scale * frequency;

                const noiseValue = SmoothNoise(sx, sy);
                noiseHeight += noiseValue * amplitude;

                amplitude *= persitance;
                frequency *= lacunarity;

            }

            if(noiseHeight < min)
            {
                min = noiseHeight;
            }

            if(noiseHeight > max)
            {
                max = noiseHeight;
            }

            noiseMap[x][y] = noiseHeight;

        }
    }

    noiseMap = noiseMap.map(e => e.map(f => (f - min) / (max - min)));

    return noiseMap;
}

function fract(n)
{
    return n - Math.floor(n);
}

function mix(a, b, c)
{
    return a + c * (b - a);
}