let debugMode = false;
let markerGaps = 20;

// NewsElement - Handles the news section of the website
class NewsElement
{
	#tags;
	#title;
	#description;

	constructor(title, description, tags, list, onClick = null)
	{
		this.#title = title;
		this.#description = description;
		this.#tags = tags;

		const listEntry = document.createElement("div");
		const tagList = document.createElement("div");
		const titleElement = document.createElement("h4");
		const descriptionElement = document.createElement("h5");

		listEntry.classList.add("list_item");
		tagList.classList.add("tag_list");
		titleElement.textContent = this.#title;
		descriptionElement.textContent = this.#description;

		this.#tags.forEach((tag) => {
			const tagElement = document.createElement("div");
			tagElement.classList.add("news_tag");
			tagElement.classList.add(tag);
			tagList.appendChild(tagElement);
		});

		listEntry.appendChild(tagList);
		listEntry.appendChild(titleElement);
		listEntry.appendChild(descriptionElement);
		list.appendChild(listEntry);

		listEntry.addEventListener("click", () => {
			onClick?.();
		});
	}
}

// ParallaxImage - Handles parallax images on the website
// Note: This only works with images whose position is not set to "fixed" or "sticky". For these cases, use the ScrollingTimeline.
class ParallaxImage
{
	self;
	#percentY;
	#percentX;

	constructor(element, x, y)
	{
		this.self = element;
		this.#percentY = y;
		this.#percentX = x;

		this.self.style.setProperty("background-position", `${this.#percentX}% ${this.#percentY}%`);
	}

	ScrollImage(scroll)
	{
		this.self.style.setProperty("background-position", `${this.#percentX}% ${this.#percentY + scroll * 20}%`);
	}
}

// ScrollingTimeline - Creates a timeline that animates elements based on scroll position.
class ScrollingTimeline
{
	#timelineElement = [];
	#animatedObjects = [];
	timelineStart;
	timelineEnd;
	playbackOffset;

	constructor(timelineElement, animatedObjects, playbackOffset = 0)
	{
		this.#timelineElement = timelineElement;
		this.#animatedObjects = animatedObjects;
		this.playbackOffset = playbackOffset;
		this.RecalculateTimeline();

		if (debugMode)
		{
			let r = Math.random() * 255;
			r = Math.round(r);
			let g = Math.random() * 255;
			g = Math.round(g);
			let b = Math.random() * 255;
			b = Math.round(b);
			const scrubPlayback = document.createElement("div");
			scrubPlayback.style.setProperty("position", "fixed");
			scrubPlayback.style.setProperty("top", `${this.playbackOffset * 100}%`);
			scrubPlayback.style.setProperty("left", "0px");
			scrubPlayback.style.setProperty("width", "100%");
			scrubPlayback.style.setProperty("height", "4px");
			scrubPlayback.style.setProperty("z-index", "1000");
			scrubPlayback.style.setProperty("background", `rgba(${r}, ${g}, ${b}, 0.5)`);
			document.body.appendChild(scrubPlayback);

			r = (r + 128) % 255;
			g = (g + 128) % 255;
			b = (b + 128) % 255;

			for(let i = 0; i <= markerGaps; i++)
			{
				let percent = 100 / markerGaps;
				this.#timelineElement.insertAdjacentHTML(
					"beforeend",
					`<div style="position: absolute; top: ${(i) * percent}%; left: 0; width: 100%; height: 1px; background: rgba(${r}, ${g}, ${b}, ${i % 2 == 1 ? 0.25 : 1}); z-index: 99;">
						<p style="position: absolute; top: -26px; color: white; z-index: 100; text-shadow: 0px 0px 4px var(--themedBlack); font-size: 12px;">${i * percent}%</p>
					</div>`
				);
			}
		}

		window.addEventListener("scroll", () => this.Evaluate());
		window.addEventListener("resize", () => this.RecalculateTimeline());
	}

	RecalculateTimeline()
	{
		const timelineRect = this.#timelineElement.getBoundingClientRect();
		this.timelineStart = timelineRect.top + scrollY;
		this.timelineEnd = timelineRect.bottom + scrollY;
	}

	Evaluate()
	{
		let scrubbedTime = MathExt.InverseLerp(this.timelineStart, this.timelineEnd, scrollY + window.innerHeight * this.playbackOffset);
		scrubbedTime = MathExt.Clamp01(scrubbedTime);
		
		this.#animatedObjects.forEach((animatedObject) => {
			animatedObject.Evaluate(scrubbedTime);
		});
	}
}
class AnimatedObject
{
	element;
	curves;

	constructor(element, curves)
	{
		this.element = element;
		this.curves = curves;
	}

	Evaluate(t)
	{
		this.curves.forEach((curve) => {	
			const value = curve.Evaluate(t);
			console.log(value);
			

			switch (curve.property)
			{
				case "opacity":
					this.element.style.setProperty("opacity", value);
					break;
				case "translate":
					this.element.style.setProperty("translate", `0px ${value}px`);
					break;
				case "rotate":
					this.element.style.setProperty("rotate", `${value}deg`);
					break;
				case "scale":
					this.element.style.setProperty("scale", value);
					break;
				case "background-position-y":
					this.element.style.setProperty("background-position", `center ${value}%`);
					break;
			}
		});
	}
}
class AnimationCurve
{
	property;
	startKeyframe;
	endKeyframe;
	curveFunction;

	constructor(property, startKeyframe, endKeyframe, easing = "linear")
	{
		this.property = property;
		this.startKeyframe = startKeyframe;
		this.endKeyframe = endKeyframe;
		this.curveFunction = easing;
	}

	Evaluate(x)
	{
		x -= this.startKeyframe.time;
		let duration = this.endKeyframe.time - this.startKeyframe.time;
		let easingTime = 0;
		
		switch(this.curveFunction)
		{
			case "linear":
				easingTime = MathExt.Clamp01(x / duration);
				break;
			case "cosined":
				easingTime = MathExt.CosinedTime(x, duration);
				break;
			case "overshoot":				
				easingTime = MathExt.OvershootEase(x, Math.E, duration);
				break;
			case "cosinePowered":
				easingTime = MathExt.PoweredCosine(x, 4, duration);
				break;
		}
		
		return MathExt.Lerp(this.startKeyframe.value, this.endKeyframe.value, easingTime);
	}
}
class Keyframe
{
	time;
	value;
	
	constructor(time, value)
	{
		this.time = time;
		this.value = value;
	}
}

// MathExt - A collection of math functions for animations and easing
class MathExt
{
	static Clamp01(value)
	{
		return Math.max(0, Math.min(1, value));
	}

	static InverseLerp(a, b, value)
	{
		if (b - a == 0)
			return 0;

		return (value - a) / (b - a);
	}
	static Lerp(a, b, t)
	{
		return a + (b - a) * t;
	}

	static CosinedTime(x, duration)
	{
		let t = x / duration;
		t = MathExt.Clamp01(t);
		return (1 - Math.cos(t * Math.PI)) / 2;
	}
	static PoweredCosine(x, power = 4, duration = 1)
	{
		let t = x / duration;
		t = MathExt.Clamp01(t);
		return Math.pow((1 - Math.cos(t * Math.PI)) / 2, power);
	}

	static OvershootEase(x, tension = Math.E, duration = 1)
	{
		let t = x / duration;
		t = MathExt.Clamp01(t);
		
		return x < duration / 2 ? MathExt.OS_EQ(0, 1, t, tension) : MathExt.OS_EQ(2, -1, t, tension);
	}
	static OS_EQ(a, sign, x, tension)
	{
		return (Math.pow(2 * x - a, 2) * ((tension + 1) * (2 * x - a) - sign * tension) + a) / 2;
	}
}